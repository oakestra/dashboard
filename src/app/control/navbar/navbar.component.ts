import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { appReducer, getOrganization, getUser } from 'src/app/root/store/index';
import { NbMenuItem } from '@nebular/theme';
import { UserService } from '../../shared/modules/auth/user.service';
import { Role } from '../../root/enums/roles';
import { MarketplaceService } from '../../shared/util/marketplace.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    menuItems: NbMenuItem[] = [];

    constructor(
        public userService: UserService,
        public store: Store<appReducer.AppState>,
        private marketplaceService: MarketplaceService
    ) {
        this.initMenu();
    }

    ngOnInit(): void {
        this.store.dispatch(getUser({ name: this.userService.getUsername() }));

        if (this.userService.hasRole(Role.ADMIN)) {
            this.store.dispatch(getOrganization());
            this.checkAndAddMarketplace();
        }
    }

    private initMenu(): void {
        this.menuItems = [
            {
                title: 'Application Dashboard',
                icon: 'home-outline',
                link: '/control',
                home: true,
            },
            {
                title: 'Service Dashboard',
                icon: 'activity',
                link: '/control/services',
            },
            {
                title: 'Available Clusters',
                icon: 'globe',
                link: '/control/clusters',
            },
            {
                title: 'Infrastructure Dashboard',
                icon: 'monitor',
                link: '/control/infrastructure',
                hidden: !this.userService.hasRole(Role.ADMIN) && !this.userService.hasRole(Role.INF_Provider),
            },
            {
                title: 'MANAGEMENT',
                group: true,
            },
            {
                title: 'Users',
                icon: 'person',
                link: '/control/users',
                hidden: !this.userService.hasRole(Role.ADMIN) && !this.userService.hasRole(Role.ORGANIZATION_ADMIN),
            },
            {
                title: 'Organisations',
                icon: 'people',
                link: '/control/organization',
                hidden: !this.userService.hasRole(Role.ADMIN),
            },
            {
                title: 'Mail Service',
                icon: 'email',
                link: '/control/settings',
                hidden: !this.userService.hasRole(Role.ADMIN),
            },
            {
                title: 'GENERAL',
                group: true,
            },
            {
                title: 'FAQ',
                icon: 'question-mark-circle',
                link: '/control/faq',
            },
            {
                title: 'Contact',
                icon: 'message-circle',
                link: '/control/help',
            },
        ];
    }

    private checkAndAddMarketplace(): void {
        this.marketplaceService.isReachable().subscribe(isAvailable => {
            if (isAvailable) {
                const marketplaceItem: NbMenuItem = {
                    title: 'Marketplace UI',
                    icon: 'shopping-cart-outline',
                    url: this.marketplaceService.getMarketplaceUrl(),
                    target: '_blank',
                };

                const generalIndex = this.menuItems.findIndex(item => item.title === 'MANAGEMENT');
                if (generalIndex !== -1) {
                    this.menuItems.splice(generalIndex, 0, marketplaceItem);
                    this.menuItems = [...this.menuItems];
                }
            }
        });
    }
}
