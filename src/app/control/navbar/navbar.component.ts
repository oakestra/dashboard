import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { appReducer, getUser } from 'src/app/root/store/index';
import { Observable } from 'rxjs';
import { UserService } from '../../shared/modules/auth/user.service';
import { AuthService, Role } from '../../shared/modules/auth/auth.service';
import { IUser } from '../../root/interfaces/user';
import { selectCurrentUser } from '../../root/store/selectors/user.selector';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSidenav)
    sidenav!: MatSidenav;
    appSelected = false;
    settings = false;

    public user$: Observable<IUser> = this.store.pipe(select(selectCurrentUser));
    userID = '';
    isAdmin = false;

    listClusters = false;
    clusterSelected = false;
    events: string[] = [];
    opened = true;

    constructor(
        private observer: BreakpointObserver,
        public userService: UserService,
        private router: Router,
        private authService: AuthService,
        public store: Store<appReducer.AppState>,
    ) {}

    ngOnInit(): void {
        this.store.dispatch(getUser({ name: this.userService.getUsername() }));

        this.user$.subscribe((user: IUser) => {
            this.userID = user._id.$oid;
        });

        this.updatePermissions();
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

    show() {
        this.appSelected = true;
    }

    logout() {
        this.authService.clear();
        this.userService.logout();
    }
}
