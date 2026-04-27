import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AddonsEndpoints, InstalledAddon } from 'src/app/root/interfaces/addon';
import { ICluster } from 'src/app/root/interfaces/cluster';
import { NotificationType } from 'src/app/root/interfaces/notification';
import { appReducer, disableAddon, getClusters, installAddon, loadInstalledAddons } from 'src/app/root/store';
import {
    selectAddonsError,
    selectAddonsLoading,
    selectInstalledAddons,
} from 'src/app/root/store/selectors/addons.selector';
import { selectAllClusters } from 'src/app/root/store/selectors/cluster.selector';
import { NotificationService } from 'src/app/shared/modules/notification/notification.service';
import { AddonsApiService } from '../../services/addons-api.service';

@Component({
    standalone: false,
    selector: 'app-installed-addons',
    templateUrl: './installed-addons.component.html',
    styleUrls: ['../../addons.scss'],
})
export class InstalledAddonsComponent implements OnChanges, OnInit {
    @Input() scope: 'root' | 'cluster' = 'root';
    @Input() cluster?: ICluster;

    addons$: Observable<InstalledAddon[]> = this.store.pipe(select(selectInstalledAddons));
    loading$: Observable<boolean> = this.store.pipe(select(selectAddonsLoading));
    error$: Observable<string> = this.store.pipe(select(selectAddonsError));
    clusters$: Observable<ICluster[]> = this.store.pipe(select(selectAllClusters));

    statusFilter = 'all';
    marketplaceId = '';
    showInstallForm = false;
    selectedAddon: InstalledAddon | null = null;
    clusterContext = '';
    installTarget: 'root' | 'cluster' = 'root';
    selectedInstallCluster = '';
    private scopedEndpoints?: Partial<AddonsEndpoints>;
    private initialized = false;

    constructor(
        private store: Store<appReducer.AppState>,
        private addonsApi: AddonsApiService,
        private notifyService: NotificationService,
    ) {}

    ngOnInit(): void {
        this.initialized = true;
        this.store.dispatch(getClusters());
        this.configureScope();
        this.loadAddons();
    }

    toggleInstallForm(): void {
        this.showInstallForm = !this.showInstallForm;
        if (this.showInstallForm && this.scope === 'root') {
            this.store.dispatch(getClusters());
            this.preselectFirstCluster();
        }
    }

    onInstallTargetChange(target: 'root' | 'cluster'): void {
        this.installTarget = target;
        if (target === 'cluster') {
            this.store.dispatch(getClusters());
            this.preselectFirstCluster();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.initialized && (changes.cluster || changes.scope)) {
            this.configureScope();
            this.loadAddons();
        }
    }

    loadAddons(): void {
        this.store.dispatch(loadInstalledAddons({ status: this.statusFilter, endpoints: this.scopedEndpoints }));
    }

    setFilter(status: string): void {
        this.statusFilter = status;
        this.loadAddons();
    }

    install(): void {
        if (this.marketplaceId.trim()) {
            this.resolveInstallTarget((endpoints) => {
                this.store.dispatch(
                    installAddon({
                        marketplaceId: this.marketplaceId.trim(),
                        endpoints,
                        refreshEndpoints: this.scopedEndpoints,
                    }),
                );
                this.marketplaceId = '';
                this.showInstallForm = false;
            });
        } else {
            this.notifyService.notify(NotificationType.error, 'Marketplace addon ID is required.');
        }
    }

    disable(id: string): void {
        if (window.confirm('Disable or uninstall this addon?')) {
            this.store.dispatch(disableAddon({ id, endpoints: this.scopedEndpoints }));
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

    getClusterKey(cluster: ICluster): string {
        return cluster._id?.$oid || cluster.cluster_name;
    }

    private configureScope(): void {
        if (this.scope === 'cluster' && this.cluster) {
            this.clusterContext = this.cluster.cluster_name;
            this.installTarget = 'cluster';
            this.selectedInstallCluster = this.getClusterKey(this.cluster);
            this.scopedEndpoints = this.addonsApi.getClusterEndpoints(this.cluster);
            return;
        }

        this.clusterContext = '';
        this.installTarget = 'root';
        this.scopedEndpoints = undefined;
    }

    private resolveInstallTarget(install: (endpoints: Partial<AddonsEndpoints> | undefined) => void): void {
        if (this.scope === 'cluster') {
            install(this.scopedEndpoints);
            return;
        }

        if (this.installTarget === 'root') {
            install(undefined);
            return;
        }

        this.clusters$.pipe(take(1)).subscribe((clusters) => {
            const cluster = clusters.find((item) => this.getClusterKey(item) === this.selectedInstallCluster);
            if (!cluster) {
                this.notifyService.notify(NotificationType.error, 'Select a cluster before installing.');
                return;
            }

            install(this.addonsApi.getClusterEndpoints(cluster));
        });
    }

    private preselectFirstCluster(): void {
        if (this.selectedInstallCluster) {
            return;
        }

        this.clusters$.pipe(take(1)).subscribe((clusters) => {
            const firstCluster = clusters[0];
            if (firstCluster) {
                this.selectedInstallCluster = this.getClusterKey(firstCluster);
            }
        });
    }
}
