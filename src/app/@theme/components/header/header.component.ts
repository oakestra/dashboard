import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LayoutService } from '../../../@core/utils';
import { UserData } from '../../../@core/data/users';
import { UserService } from '../../../shared/modules/auth/user.service';
import { IUser } from '../../../root/interfaces/user';

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
