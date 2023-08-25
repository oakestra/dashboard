import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { delay, filter, tap } from 'rxjs/operators';
import { Router, Scroll } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { appReducer, getOrganization, getUser } from 'src/app/root/store/index';
import { Observable } from 'rxjs';
import { selectCurrentApplication } from 'src/app/root/store/selectors/application.selector';
import { UserService } from '../../shared/modules/auth/user.service';
import { AuthService } from '../../shared/modules/auth/auth.service';
import { IUser } from '../../root/interfaces/user';
import { selectCurrentUser } from '../../root/store/selectors/user.selector';
import { ApiService } from '../../shared/modules/api/api.service';
import { IOrganization } from '../../root/interfaces/organization';
import { selectOrganization } from '../../root/store/selectors/organization.selector';
import { Role } from '../../root/enums/roles';
import { MENU_ITEMS } from '../control-menu';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    menuItems = MENU_ITEMS;

    @ViewChild(MatSidenav)
    sidenav!: MatSidenav;

    public user$: Observable<IUser> = this.store.pipe(select(selectCurrentUser));
    public org$: Observable<IOrganization[]> = this.store.pipe(select(selectOrganization));
    userID = '';
    // TODO Do not create a var for every role, do this different
    isAdmin = false;
    isOrgaProvider = false;
    showWelcome = true;

    private appSelected = false;
    private appView = false;

    events: string[] = [];
    opened = true;

    constructor(
        private observer: BreakpointObserver,
        public userService: UserService,
        private authService: AuthService,
        public store: Store<appReducer.AppState>,
        public api: ApiService,
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
        if (this.isAdmin) {
            this.store.dispatch(getOrganization());
            this.org$.subscribe((x) => console.log(x));
        }

        this.isOrgaProvider = this.userService.hasRole(Role.ORGANIZATION_ADMIN);

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

    updatePermissions(): void {
        this.isAdmin = this.userService.hasRole(Role.ADMIN);
    }

    onToolbarToggle() {
        this.opened = !this.opened;
    }

    logout() {
        this.authService.clear();
        this.userService.logout();
    }
}
