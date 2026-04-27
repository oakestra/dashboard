import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AddonNetwork, AddonService, AddonVolume, MarketplaceAddon } from 'src/app/root/interfaces/addon';
import { ICluster } from 'src/app/root/interfaces/cluster';
import { NotificationType } from 'src/app/root/interfaces/notification';
import { appReducer, createMarketplaceAddon, deleteMarketplaceAddon, getClusters, installAddon, loadMarketplaceAddons } from 'src/app/root/store';
import {
    selectAddonsError,
    selectAddonsLoading,
    selectMarketplaceAddons,
} from 'src/app/root/store/selectors/addons.selector';
import { selectAllClusters } from 'src/app/root/store/selectors/cluster.selector';
import { NotificationService } from 'src/app/shared/modules/notification/notification.service';
import { AddonsApiService } from '../../services/addons-api.service';

@Component({
    standalone: false,
    selector: 'app-addons-marketplace',
    templateUrl: './addons-marketplace.component.html',
    styleUrls: ['../../addons.scss'],
})
export class AddonsMarketplaceComponent implements OnInit {
    addons$: Observable<MarketplaceAddon[]> = this.store.pipe(select(selectMarketplaceAddons));
    loading$: Observable<boolean> = this.store.pipe(select(selectAddonsLoading));
    error$: Observable<string> = this.store.pipe(select(selectAddonsError));
    clusters$: Observable<ICluster[]> = this.store.pipe(select(selectAllClusters));

    showForm = false;
    useJsonMode = false;
    selectedAddon: MarketplaceAddon | null = null;
    addonJson = this.getTemplate();
    newAddon: MarketplaceAddon = this.getEmptyAddon();
    currentService: AddonService = this.getEmptyService();
    currentVolume: AddonVolume = this.getEmptyVolume();
    currentNetwork: AddonNetwork = this.getEmptyNetwork();
    pendingInstallAddon: MarketplaceAddon | null = null;
    installTarget: 'root' | 'cluster' = 'root';
    selectedInstallCluster = '';
    editingServiceIndex = -1;
    editingVolumeIndex = -1;
    editingNetworkIndex = -1;
    showServiceForm = false;
    showVolumeForm = false;
    showNetworkForm = false;

    constructor(
        private store: Store<appReducer.AppState>,
        private addonsApi: AddonsApiService,
        private notifyService: NotificationService,
    ) {}

    ngOnInit(): void {
        this.addonsApi.clearEndpointOverrides();
        this.store.dispatch(getClusters());
        this.loadAddons();
    }

    loadAddons(): void {
        this.store.dispatch(loadMarketplaceAddons());
    }

    toggleForm(): void {
        this.showForm = !this.showForm;
        if (this.showForm) {
            this.resetForm();
        }
    }

    submitAddon(): void {
        try {
            const addon = this.useJsonMode ? (JSON.parse(this.addonJson) as MarketplaceAddon) : this.buildManualAddon();

            if (!addon.name || !addon.services?.length) {
                this.notifyService.notify(NotificationType.error, 'Addon must have a name and at least one service.');
                return;
            }

            this.store.dispatch(createMarketplaceAddon({ addon }));
            this.showForm = false;
            this.resetForm();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Invalid addon data';
            this.notifyService.notify(NotificationType.error, message);
        }
    }

    addService(): void {
        if (!this.currentService.service_name.trim() || !this.currentService.image.trim()) {
            this.notifyService.notify(NotificationType.error, 'Service name and image are required.');
            return;
        }

        const service = this.cleanService(this.currentService);
        if (this.editingServiceIndex >= 0) {
            this.newAddon.services[this.editingServiceIndex] = service;
            this.editingServiceIndex = -1;
            this.notifyService.notify(NotificationType.success, 'Service updated');
        } else {
            this.newAddon.services.push(service);
            this.notifyService.notify(NotificationType.success, 'Service added to addon');
        }

        this.currentService = this.getEmptyService();
        this.showServiceForm = false;
    }

    editService(index: number): void {
        this.currentService = this.cloneService(this.newAddon.services[index]);
        this.editingServiceIndex = index;
        this.showServiceForm = false;
    }

    cancelServiceEdit(): void {
        this.currentService = this.getEmptyService();
        this.editingServiceIndex = -1;
    }

    showAddServiceForm(): void {
        this.cancelServiceEdit();
        this.showServiceForm = true;
    }

    hideAddServiceForm(): void {
        this.currentService = this.getEmptyService();
        this.showServiceForm = false;
    }

    removeService(index: number): void {
        this.newAddon.services.splice(index, 1);
        if (this.editingServiceIndex === index) {
            this.cancelServiceEdit();
        } else if (this.editingServiceIndex > index) {
            this.editingServiceIndex--;
        }
    }

    addPort(item: { key: string; value: string }): void {
        if (!item.key.trim() || !item.value.trim()) {
            return;
        }
        this.currentService.ports = { ...(this.currentService.ports || {}), [item.key]: item.value };
    }

    removePort(key: string): void {
        if (this.currentService.ports) {
            delete this.currentService.ports[key];
        }
    }

    addEnvironment(item: { key: string; value: string }): void {
        if (!item.key.trim() || !item.value.trim()) {
            return;
        }
        this.currentService.environment = { ...(this.currentService.environment || {}), [item.key]: item.value };
    }

    removeEnvironment(key: string): void {
        if (this.currentService.environment) {
            delete this.currentService.environment[key];
        }
    }

    addLabel(item: { key: string; value: string }): void {
        if (!item.key.trim() || !item.value.trim()) {
            return;
        }
        this.currentService.labels = { ...(this.currentService.labels || {}), [item.key]: item.value };
    }

    removeLabel(key: string): void {
        if (this.currentService.labels) {
            delete this.currentService.labels[key];
        }
    }

    addServiceVolume(value: string): void {
        const mount = value.trim();
        if (!mount) {
            return;
        }
        this.currentService.volumes = [...(this.currentService.volumes || []), mount];
        const volumeName = mount.split(':')[0]?.trim();
        if (volumeName && !volumeName.startsWith('/') && !volumeName.startsWith('.')) {
            this.autoCreateVolume(volumeName);
        }
    }

    removeServiceVolume(index: number): void {
        this.currentService.volumes = (this.currentService.volumes || []).filter((_, itemIndex) => itemIndex !== index);
    }

    addServiceNetwork(value: string): void {
        const networkName = value.trim();
        if (!networkName) {
            return;
        }
        this.currentService.networks = [...(this.currentService.networks || []), networkName];
        this.autoCreateNetwork(networkName);
    }

    removeServiceNetwork(index: number): void {
        this.currentService.networks = (this.currentService.networks || []).filter((_, itemIndex) => itemIndex !== index);
    }

    addVolumeOption(item: { key: string; value: string }): void {
        if (!item.key.trim() || !item.value.trim()) {
            return;
        }
        this.currentVolume.driver_opts = { ...(this.currentVolume.driver_opts || {}), [item.key]: item.value };
    }

    removeVolumeOption(key: string): void {
        if (this.currentVolume.driver_opts) {
            delete this.currentVolume.driver_opts[key];
        }
    }

    addVolume(): void {
        if (!this.currentVolume.name.trim()) {
            this.notifyService.notify(NotificationType.error, 'Volume name is required.');
            return;
        }

        const volume = this.cleanVolume(this.currentVolume);
        this.newAddon.volumes = this.newAddon.volumes || [];
        if (this.editingVolumeIndex >= 0) {
            this.newAddon.volumes[this.editingVolumeIndex] = volume;
            this.editingVolumeIndex = -1;
            this.notifyService.notify(NotificationType.success, 'Volume updated');
        } else {
            this.newAddon.volumes.push(volume);
            this.notifyService.notify(NotificationType.success, 'Volume added');
        }

        this.currentVolume = this.getEmptyVolume();
        this.showVolumeForm = false;
    }

    editVolume(index: number): void {
        this.currentVolume = this.cloneVolume(this.newAddon.volumes?.[index] || this.getEmptyVolume());
        this.editingVolumeIndex = index;
        this.showVolumeForm = false;
    }

    cancelVolumeEdit(): void {
        this.currentVolume = this.getEmptyVolume();
        this.editingVolumeIndex = -1;
    }

    showAddVolumeForm(): void {
        this.cancelVolumeEdit();
        this.showVolumeForm = true;
    }

    hideAddVolumeForm(): void {
        this.currentVolume = this.getEmptyVolume();
        this.showVolumeForm = false;
    }

    removeVolume(index: number): void {
        this.newAddon.volumes = (this.newAddon.volumes || []).filter((_, itemIndex) => itemIndex !== index);
        if (this.editingVolumeIndex === index) {
            this.cancelVolumeEdit();
        } else if (this.editingVolumeIndex > index) {
            this.editingVolumeIndex--;
        }
    }

    addNetwork(): void {
        if (!this.currentNetwork.name.trim()) {
            this.notifyService.notify(NotificationType.error, 'Network name is required.');
            return;
        }

        const network = this.cleanNetwork(this.currentNetwork);
        this.newAddon.networks = this.newAddon.networks || [];
        if (this.editingNetworkIndex >= 0) {
            this.newAddon.networks[this.editingNetworkIndex] = network;
            this.editingNetworkIndex = -1;
            this.notifyService.notify(NotificationType.success, 'Network updated');
        } else {
            this.newAddon.networks.push(network);
            this.notifyService.notify(NotificationType.success, 'Network added');
        }

        this.currentNetwork = this.getEmptyNetwork();
        this.showNetworkForm = false;
    }

    editNetwork(index: number): void {
        this.currentNetwork = this.cloneNetwork(this.newAddon.networks?.[index] || this.getEmptyNetwork());
        this.editingNetworkIndex = index;
        this.showNetworkForm = false;
    }

    cancelNetworkEdit(): void {
        this.currentNetwork = this.getEmptyNetwork();
        this.editingNetworkIndex = -1;
    }

    showAddNetworkForm(): void {
        this.cancelNetworkEdit();
        this.showNetworkForm = true;
    }

    hideAddNetworkForm(): void {
        this.currentNetwork = this.getEmptyNetwork();
        this.showNetworkForm = false;
    }

    removeNetwork(index: number): void {
        this.newAddon.networks = (this.newAddon.networks || []).filter((_, itemIndex) => itemIndex !== index);
        if (this.editingNetworkIndex === index) {
            this.cancelNetworkEdit();
        } else if (this.editingNetworkIndex > index) {
            this.editingNetworkIndex--;
        }
    }

    deleteAddon(id: string | undefined): void {
        if (id && window.confirm('Delete this addon from the marketplace?')) {
            this.store.dispatch(deleteMarketplaceAddon({ id }));
        }
    }

    installAddon(addon: MarketplaceAddon): void {
        if (addon._id) {
            this.store.dispatch(getClusters());
            this.pendingInstallAddon = addon;
            this.installTarget = 'root';
            this.selectedInstallCluster = '';
        }
    }

    onInstallTargetChange(target: 'root' | 'cluster'): void {
        this.installTarget = target;
        if (target === 'cluster') {
            this.store.dispatch(getClusters());
            this.preselectFirstCluster();
        }
    }

    confirmInstall(): void {
        if (!this.pendingInstallAddon?._id) {
            return;
        }

        if (this.installTarget === 'root') {
            this.store.dispatch(installAddon({ marketplaceId: this.pendingInstallAddon._id, reloadInstalled: false }));
            this.pendingInstallAddon = null;
            return;
        }

        this.clusters$.pipe(take(1)).subscribe((clusters) => {
            const cluster = clusters.find((item) => this.getClusterKey(item) === this.selectedInstallCluster);
            if (!cluster) {
                this.notifyService.notify(NotificationType.error, 'Select a cluster before installing.');
                return;
            }

            this.store.dispatch(
                installAddon({
                    marketplaceId: this.pendingInstallAddon?._id || '',
                    endpoints: this.addonsApi.getClusterEndpoints(cluster),
                    reloadInstalled: false,
                }),
            );
            this.pendingInstallAddon = null;
        });
    }

    cancelInstall(): void {
        this.pendingInstallAddon = null;
    }

    viewDetails(addon: MarketplaceAddon): void {
        this.selectedAddon = addon;
    }

    closeDetails(): void {
        this.selectedAddon = null;
    }

    format(value: unknown): string {
        return JSON.stringify(value, null, 2);
    }

    getObjectAsArray(obj: Record<string, string> | undefined): { key: string; value: string }[] {
        return Object.entries(obj || {}).map(([key, value]) => {
            return { key, value };
        });
    }

    getClusterKey(cluster: ICluster): string {
        return cluster._id?.$oid || cluster.cluster_name;
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

    formatKeyValue(obj: Record<string, string> | undefined, separator: ':' | '='): string {
        return this.getObjectAsArray(obj).map((item) => `${item.key}${separator}${item.value}`).join(', ');
    }

    formatAddon(addon: MarketplaceAddon): string {
        return JSON.stringify(
            {
                name: addon.name,
                description: addon.description,
                services: addon.services || [],
                volumes: addon.volumes || [],
                networks: addon.networks || [],
            },
            null,
            2,
        );
    }

    private resetForm(): void {
        this.useJsonMode = false;
        this.addonJson = this.getTemplate();
        this.newAddon = this.getEmptyAddon();
        this.currentService = this.getEmptyService();
        this.currentVolume = this.getEmptyVolume();
        this.currentNetwork = this.getEmptyNetwork();
        this.editingServiceIndex = -1;
        this.editingVolumeIndex = -1;
        this.editingNetworkIndex = -1;
        this.showServiceForm = false;
        this.showVolumeForm = false;
        this.showNetworkForm = false;
    }

    private getEmptyAddon(): MarketplaceAddon {
        return {
            name: '',
            description: '',
            services: [],
            volumes: [],
            networks: [],
        };
    }

    private getEmptyService(): AddonService {
        return {
            service_name: '',
            image: '',
            command: '',
            ports: {},
            environment: {},
            labels: {},
            volumes: [],
            networks: [],
        };
    }

    private getEmptyVolume(): AddonVolume {
        return {
            name: '',
            driver: 'local',
            driver_opts: {},
            labels: {},
        };
    }

    private getEmptyNetwork(): AddonNetwork {
        return {
            name: '',
            driver: 'bridge',
            enable_ipv6: false,
        };
    }

    private buildManualAddon(): MarketplaceAddon {
        if (this.hasServiceDraft() || this.hasVolumeDraft() || this.hasNetworkDraft()) {
            throw new Error('Finish adding or editing the open service, volume, or network before submitting.');
        }

        const services = this.newAddon.services.map((service) => this.cleanService(service));
        const volumes = this.withAutoCreatedVolumes((this.newAddon.volumes || []).map((volume) => this.cleanVolume(volume)), services);
        const networks = this.withAutoCreatedNetworks((this.newAddon.networks || []).map((network) => this.cleanNetwork(network)), services);

        return {
            name: this.newAddon.name.trim(),
            description: this.newAddon.description?.trim(),
            services,
            volumes: volumes.length ? volumes : undefined,
            networks: networks.length ? networks : undefined,
        };
    }

    private withAutoCreatedVolumes(volumes: AddonVolume[], services: AddonService[]): AddonVolume[] {
        const result = [...volumes];

        services
            .flatMap((service) => service.volumes || [])
            .map((volume) => volume.split(':')[0]?.trim())
            .filter((volumeName) => volumeName && !volumeName.startsWith('/') && !volumeName.startsWith('.'))
            .forEach((volumeName) => {
                if (!result.some((volume) => volume.name === volumeName)) {
                    result.push({ name: volumeName, driver: 'local' });
                }
            });

        return result;
    }

    private autoCreateVolume(volumeName: string): void {
        this.newAddon.volumes = this.newAddon.volumes || [];
        if (!this.newAddon.volumes.some((volume) => volume.name === volumeName)) {
            this.newAddon.volumes.push({ name: volumeName, driver: 'local', driver_opts: {}, labels: {} });
            this.notifyService.notify(NotificationType.information, `Volume '${volumeName}' auto-created`);
        }
    }

    private autoCreateNetwork(networkName: string): void {
        this.newAddon.networks = this.newAddon.networks || [];
        if (!this.newAddon.networks.some((network) => network.name === networkName)) {
            this.newAddon.networks.push({ name: networkName, driver: 'bridge', enable_ipv6: false });
            this.notifyService.notify(NotificationType.information, `Network '${networkName}' auto-created`);
        }
    }

    private cleanService(service: AddonService): AddonService {
        return {
            service_name: service.service_name.trim(),
            image: service.image.trim(),
            command: service.command?.trim() || undefined,
            ports: this.cleanRecord(service.ports),
            environment: this.cleanRecord(service.environment),
            labels: this.cleanRecord(service.labels),
            volumes: this.cleanList(service.volumes),
            networks: this.cleanList(service.networks),
        };
    }

    private cleanVolume(volume: AddonVolume): AddonVolume {
        return {
            name: volume.name.trim(),
            driver: volume.driver?.trim() || 'local',
            driver_opts: this.cleanRecord(volume.driver_opts),
            labels: this.cleanRecord(volume.labels),
        };
    }

    private cleanNetwork(network: AddonNetwork): AddonNetwork {
        return {
            name: network.name.trim(),
            driver: network.driver?.trim() || 'bridge',
            enable_ipv6: !!network.enable_ipv6,
        };
    }

    private cleanRecord(record: Record<string, string> | undefined): Record<string, string> | undefined {
        const entries = Object.entries(record || {})
            .map(([key, value]) => [key.trim(), String(value).trim()] as [string, string])
            .filter(([key, value]) => key && value);

        return entries.length ? Object.fromEntries(entries) : undefined;
    }

    private cleanList(items: string[] | undefined): string[] | undefined {
        const cleaned = (items || []).map((item) => item.trim()).filter(Boolean);
        return cleaned.length ? cleaned : undefined;
    }

    private cloneService(service: AddonService): AddonService {
        return {
            ...service,
            ports: { ...(service.ports || {}) },
            environment: { ...(service.environment || {}) },
            labels: { ...(service.labels || {}) },
            volumes: [...(service.volumes || [])],
            networks: [...(service.networks || [])],
        };
    }

    private cloneVolume(volume: AddonVolume): AddonVolume {
        return {
            ...volume,
            driver_opts: { ...(volume.driver_opts || {}) },
            labels: { ...(volume.labels || {}) },
        };
    }

    private cloneNetwork(network: AddonNetwork): AddonNetwork {
        return { ...network };
    }

    private hasServiceDraft(): boolean {
        return (
            this.editingServiceIndex >= 0 ||
            this.showServiceForm ||
            !!this.currentService.service_name.trim() ||
            !!this.currentService.image.trim() ||
            !!this.currentService.command?.trim() ||
            !!this.getObjectAsArray(this.currentService.ports).length ||
            !!this.getObjectAsArray(this.currentService.environment).length ||
            !!this.getObjectAsArray(this.currentService.labels).length ||
            !!this.currentService.volumes?.length ||
            !!this.currentService.networks?.length
        );
    }

    private hasVolumeDraft(): boolean {
        return (
            this.editingVolumeIndex >= 0 ||
            this.showVolumeForm ||
            !!this.currentVolume.name.trim() ||
            this.currentVolume.driver !== 'local' ||
            !!this.getObjectAsArray(this.currentVolume.driver_opts).length ||
            !!this.getObjectAsArray(this.currentVolume.labels).length
        );
    }

    private hasNetworkDraft(): boolean {
        return (
            this.editingNetworkIndex >= 0 ||
            this.showNetworkForm ||
            !!this.currentNetwork.name.trim() ||
            this.currentNetwork.driver !== 'bridge' ||
            !!this.currentNetwork.enable_ipv6
        );
    }

    private withAutoCreatedNetworks(networks: AddonNetwork[], services: AddonService[]): AddonNetwork[] {
        const result = [...networks];

        services
            .flatMap((service) => service.networks || [])
            .filter(Boolean)
            .forEach((networkName) => {
                if (!result.some((network) => network.name === networkName)) {
                    result.push({ name: networkName, driver: 'bridge', enable_ipv6: false });
                }
            });

        return result;
    }

    private getTemplate(): string {
        return JSON.stringify(
            {
                name: 'my-addon',
                description: 'My addon description',
                services: [
                    {
                        service_name: 'my-service',
                        image: 'alpine:latest',
                        command: 'echo hello',
                        ports: { 8080: '80' },
                        environment: { KEY: 'value' },
                        volumes: ['volume1:/data'],
                        networks: ['network1'],
                    },
                ],
                volumes: [{ name: 'volume1', driver: 'local' }],
                networks: [{ name: 'network1', driver: 'bridge', enable_ipv6: false }],
            },
            null,
            2,
        );
    }
}
