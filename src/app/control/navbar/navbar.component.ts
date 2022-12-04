import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { appReducer } from 'src/app/root/store/index';
import { SharedIDService } from '../../shared/modules/helper/shared-id.service';
import { ApiService } from '../../shared/modules/api/api.service';
import { UserService } from '../../shared/modules/auth/user.service';
import { AuthService, Role } from '../../shared/modules/auth/auth.service';
import { IApplication } from '../../root/interfaces/application';
import { IUser } from '../../root/interfaces/user';
import { selectCurrentService } from '../../root/store/selectors/service.selector';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSidenav)
    sidenav!: MatSidenav;

    apps: IApplication[];

    appSelected = false; // can i use activeApp != null?
    settings = false;

    // TODO Get the user instead of every single element
    username = '';
    userID = '';
    isAdmin = false;

    listClusters = false;
    clusterSelected = false;
    events: string[] = [];
    opened = true;

    public services$ = this.store.pipe(select(selectCurrentService));

    constructor(
        private observer: BreakpointObserver,
        public sharedService: SharedIDService,
        private api: ApiService,
        public userService: UserService,
        private router: Router,
        private authService: AuthService,
        public store: Store<appReducer.AppState>,
    ) {
        router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
            this.showData(e.url);
        });
    }

    ngOnInit(): void {
        this.username = this.userService.getUsername();
        this.api.getUserByName(this.username).subscribe((data: IUser) => {
            this.userID = data._id.$oid;
        });
        this.sharedService.userID = this.userID;
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

    showData(url: string) {
        this.settings =
            url.includes('help') || url.includes('user') || url.includes('profile') || url.includes('survey');
    }

    updatePermissions(): void {
        this.authService.hasRole(Role.ADMIN).subscribe((isAdmin) => {
            this.isAdmin = isAdmin;
        });
    }

    redirectTo(uri: string) {
        void this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([uri]));
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

    viewSelected() {
        return this.appSelected || this.settings || this.listClusters || this.clusterSelected;
    }
}
