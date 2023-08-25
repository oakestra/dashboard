import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LayoutService } from '../../../@core/utils';
import { UserService } from '../../../shared/modules/auth/user.service';
import { IUser } from '../../../root/interfaces/user';
import { AuthService } from '../../../shared/modules/auth/auth.service';

@Component({
    selector: 'ngx-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    userPictureOnly = false;
    user: any;
    userMenu = [
        { title: 'Profile', icon: 'person', link: '/control/profile' },
        { title: 'Log out', icon: 'log-out' },
    ];

    constructor(
        private sidebarService: NbSidebarService,
        private menuService: NbMenuService,
        private themeService: NbThemeService,
        private userService: UserService,
        private layoutService: LayoutService,
        private breakpointService: NbMediaBreakpointsService,
        private authService: AuthService,
    ) {}

    ngOnInit() {
        this.userService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe((user: IUser) => (this.user = user));

        const { xl } = this.breakpointService.getBreakpointsMap();
        this.themeService
            .onMediaQueryChange()
            .pipe(
                map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
                takeUntil(this.destroy$),
            )
            .subscribe((isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl));

        this.menuService
            .onItemClick()
            .pipe(
                filter(({ tag }) => tag === 'userMenu'),
                map(({ item: { title } }) => title),
            )
            .subscribe((title) => {
                switch (title) {
                    case 'Log out':
                        this.authService.clear();
                        this.userService.logout();
                        break;
                }
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    toggleSidebar(): boolean {
        this.sidebarService.toggle(true, 'menu-sidebar');
        this.layoutService.changeLayoutSize();

        return false;
    }

    navigateHome() {
        this.menuService.navigateHome();
        return false;
    }
}
