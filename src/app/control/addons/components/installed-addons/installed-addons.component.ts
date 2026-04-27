import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { InstalledAddon } from 'src/app/root/interfaces/addon';
import { NotificationType } from 'src/app/root/interfaces/notification';
import { appReducer, disableAddon, installAddon, loadInstalledAddons } from 'src/app/root/store';
import {
    selectAddonsError,
    selectAddonsLoading,
    selectInstalledAddons,
} from 'src/app/root/store/selectors/addons.selector';
import { NotificationService } from 'src/app/shared/modules/notification/notification.service';
import { AddonsApiService } from '../../services/addons-api.service';

@Component({
    standalone: false,
    selector: 'app-installed-addons',
    templateUrl: './installed-addons.component.html',
    styleUrls: ['../../addons.scss'],
})
export class InstalledAddonsComponent implements OnInit {
    addons$: Observable<InstalledAddon[]> = this.store.pipe(select(selectInstalledAddons));
    loading$: Observable<boolean> = this.store.pipe(select(selectAddonsLoading));
    error$: Observable<string> = this.store.pipe(select(selectAddonsError));

    statusFilter = 'all';
    marketplaceId = '';
    showInstallForm = false;
    selectedAddon: InstalledAddon | null = null;
    clusterContext = '';

    constructor(
        private store: Store<appReducer.AppState>,
        private route: ActivatedRoute,
        private addonsApi: AddonsApiService,
        private notifyService: NotificationService,
    ) {}

    ngOnInit(): void {
        this.clusterContext = this.route.snapshot.queryParamMap.get('cluster') || '';
        const addonsEngineUrl = this.route.snapshot.queryParamMap.get('addonsEngineUrl');
        const resourceAbstractorUrl = this.route.snapshot.queryParamMap.get('resourceAbstractorUrl');
        if (addonsEngineUrl || resourceAbstractorUrl) {
            this.addonsApi.setEndpointOverrides({
                addonsEngineUrl: addonsEngineUrl || undefined,
                resourceAbstractorUrl: resourceAbstractorUrl || undefined,
            });
        } else {
            this.addonsApi.clearEndpointOverrides();
        }
        this.loadAddons();
    }

    loadAddons(): void {
        this.store.dispatch(loadInstalledAddons({ status: this.statusFilter }));
    }

    setFilter(status: string): void {
        this.statusFilter = status;
        this.loadAddons();
    }

    install(): void {
        if (this.marketplaceId.trim()) {
            this.store.dispatch(installAddon({ marketplaceId: this.marketplaceId.trim() }));
            this.marketplaceId = '';
            this.showInstallForm = false;
        } else {
            this.notifyService.notify(NotificationType.error, 'Marketplace addon ID is required.');
        }
    }

    disable(id: string): void {
        if (window.confirm('Disable or uninstall this addon?')) {
            this.store.dispatch(disableAddon({ id }));
        }
    }

    viewDetails(addon: InstalledAddon): void {
        this.selectedAddon = addon;
    }

    closeDetails(): void {
        this.selectedAddon = null;
    }

    getStatusClass(status: string): string {
        return status?.toLowerCase().trim() || 'unknown';
    }

    getDisableActionLabel(status: string): string {
        return this.getStatusClass(status) === 'disabled' ? 'Uninstall' : 'Disable';
    }

    format(value: unknown): string {
        return JSON.stringify(value, null, 2);
    }
}
