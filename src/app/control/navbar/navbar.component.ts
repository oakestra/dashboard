import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { delay, filter, tap } from 'rxjs/operators';
import { Router, Scroll } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { appReducer, getUser } from 'src/app/root/store/index';
import { Observable } from 'rxjs';
import { UserService } from '../../shared/modules/auth/user.service';
import { AuthService, Role } from '../../shared/modules/auth/auth.service';
import { IUser } from '../../root/interfaces/user';
import { selectCurrentUser } from '../../root/store/selectors/user.selector';
import { selectCurrentApplication } from '../../root/store/selectors/application.selector';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSidenav)
    sidenav!: MatSidenav;

    public user$: Observable<IUser> = this.store.pipe(select(selectCurrentUser));
    userID = '';
    isAdmin = false;
    showWelcome = true;

    private appSelected = false;
    private appView = false;

    listClusters = false;
    clusterSelected = false;
    events: string[] = [];
    opened = true;

    constructor(
        private observer: BreakpointObserver,
        public userService: UserService,
        private authService: AuthService,
        public store: Store<appReducer.AppState>,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.store.dispatch(getUser({ name: this.userService.getUsername() }));

        this.user$.subscribe((user: IUser) => {
            if (user) {
                this.userID = user._id.$oid;
            }
        });

        this.updatePermissions();

        // To show the welcome page if nothing is selected
        this.router.events
            .pipe(
                tap(() => {
                    this.showWelcome = false;
                    this.appView = false;
                }),
                filter((event) => event instanceof Scroll && event.routerEvent.url === '/control'),
            )
            .subscribe(() => {
                this.appView = true;
                this.showWelcome = this.appSelected;
            });

        this.store
            .select(selectCurrentApplication)
            .pipe(
                tap(() => {
                    this.showWelcome = false;
                    this.appSelected = false;
                }),
                filter((app) => app === null),
            )
            .subscribe(() => {
                this.appSelected = true;
                this.showWelcome = this.appView;
            });
    }

    // For the responsive sidenav
    ngAfterViewInit() {
        this.observer
            .observe(['(max-width: 800px)'])
            .pipe(delay(1))
            .subscribe((res) => {
                if (res.matches) {
                    this.sidenav.mode = 'over';
                    void this.sidenav.close();
                } else {
                    this.sidenav.mode = 'side';
                    void this.sidenav.open();
                }
            });
    }

    updatePermissions(): void {
        this.authService.hasRole(Role.ADMIN).subscribe((isAdmin) => {
            this.isAdmin = isAdmin;
            this.isAdmin = true;
        });
    }

    switchScreen(app: boolean, list: boolean, cluster: boolean) {
        this.appSelected = app;
        this.listClusters = list;
        this.clusterSelected = cluster;
    }

    resetDashboard() {
        this.switchScreen(false, false, false);
    }

    onToolbarToggle() {
        this.opened = !this.opened;
    }

    logout() {
        this.authService.clear();
        this.userService.logout();
    }
}
