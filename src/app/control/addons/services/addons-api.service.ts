import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AddonsEndpoints, CustomResource, Hook, InstalledAddon, MarketplaceAddon } from 'src/app/root/interfaces/addon';
import { ICluster } from 'src/app/root/interfaces/cluster';

@Injectable({
    providedIn: 'root',
})
export class AddonsApiService {
    private endpointOverrides: Partial<AddonsEndpoints> = {};

    constructor(private http: HttpClient) {}

    get endpoints(): AddonsEndpoints {
        return this.getEndpoints();
    }

    getRootEndpoints(): AddonsEndpoints {
        const root = this.getApiRoot();
        const env = (window as unknown as { env?: Record<string, string> }).env || {};

        const defaults = {
            marketplaceUrl: env.MARKETPLACE_URL || `${root.protocol}//${root.hostname}:11102`,
            addonsEngineUrl: env.ADDONS_ENGINE_URL || `${root.protocol}//${root.hostname}:11101`,
            resourceAbstractorUrl: env.RESOURCE_ABSTRACTOR_URL || `${root.protocol}//${root.hostname}:11011`,
            marketplaceUiUrl: env.ADDONS_DASHBOARD_URL || `${root.protocol}//${root.hostname}:11103`,
        };

        return defaults;
    }

    getClusterEndpoints(cluster?: Partial<ICluster>): AddonsEndpoints {
        const root = this.getApiRoot();
        const rootEndpoints = this.getRootEndpoints();
        const host = this.getClusterHost(cluster, root.hostname) || root.hostname;

        return {
            marketplaceUrl: rootEndpoints.marketplaceUrl,
            addonsEngineUrl: cluster?.addonsEngineUrl || cluster?.addons_engine_url || cluster?.addons_manager_url || `${root.protocol}//${host}:11201`,
            resourceAbstractorUrl:
                cluster?.resourceAbstractorUrl || cluster?.resource_abstractor_url || `${root.protocol}//${host}:11012`,
            marketplaceUiUrl: rootEndpoints.marketplaceUiUrl,
        };
    }

    setEndpointOverrides(overrides: Partial<AddonsEndpoints>): void {
        this.endpointOverrides = overrides;
    }

    clearEndpointOverrides(): void {
        this.endpointOverrides = {};
    }

    getMarketplaceAddons(endpoints?: Partial<AddonsEndpoints>): Observable<MarketplaceAddon[]> {
        return this.http.get<MarketplaceAddon[]>(`${this.getEndpoints(endpoints).marketplaceUrl}/api/v1/marketplace/addons`);
    }

    createMarketplaceAddon(addon: MarketplaceAddon, endpoints?: Partial<AddonsEndpoints>): Observable<MarketplaceAddon> {
        return this.http.post<MarketplaceAddon>(`${this.getEndpoints(endpoints).marketplaceUrl}/api/v1/marketplace/addons`, addon);
    }

    deleteMarketplaceAddon(id: string, endpoints?: Partial<AddonsEndpoints>): Observable<void> {
        return this.http.delete<void>(`${this.getEndpoints(endpoints).marketplaceUrl}/api/v1/marketplace/addons/${id}`);
    }

    getInstalledAddons(query?: Record<string, string>, endpoints?: Partial<AddonsEndpoints>): Observable<InstalledAddon[]> {
        let params = new HttpParams();
        const filters = query || {};
        Object.keys(filters).forEach((key) => {
            const value = filters[key];
            if (value) {
                params = params.set(key, value);
            }
        });
        return this.http.get<InstalledAddon[]>(`${this.getEndpoints(endpoints).addonsEngineUrl}/api/v1/addons`, { params });
    }

    installAddon(marketplaceId: string, endpoints?: Partial<AddonsEndpoints>): Observable<InstalledAddon> {
        return this.http.post<InstalledAddon>(`${this.getEndpoints(endpoints).addonsEngineUrl}/api/v1/addons`, {
            marketplace_id: marketplaceId,
        });
    }

    disableAddon(id: string, endpoints?: Partial<AddonsEndpoints>): Observable<InstalledAddon> {
        return this.http.delete<InstalledAddon>(`${this.getEndpoints(endpoints).addonsEngineUrl}/api/v1/addons/${id}`);
    }

    getHooks(endpoints?: Partial<AddonsEndpoints>): Observable<Hook[]> {
        return this.http.get<Hook[]>(`${this.getEndpoints(endpoints).resourceAbstractorUrl}/api/v1/hooks`);
    }

    createHook(hook: Hook, endpoints?: Partial<AddonsEndpoints>): Observable<Hook> {
        return this.http.post<Hook>(`${this.getEndpoints(endpoints).resourceAbstractorUrl}/api/v1/hooks`, hook);
    }

    deleteHook(id: string, endpoints?: Partial<AddonsEndpoints>): Observable<void> {
        return this.http.delete<void>(`${this.getEndpoints(endpoints).resourceAbstractorUrl}/api/v1/hooks/${id}`);
    }

    getCustomResources(endpoints?: Partial<AddonsEndpoints>): Observable<CustomResource[]> {
        return this.http.get<CustomResource[]>(`${this.getEndpoints(endpoints).resourceAbstractorUrl}/api/v1/custom-resources`);
    }

    createCustomResource(resource: CustomResource, endpoints?: Partial<AddonsEndpoints>): Observable<CustomResource> {
        return this.http.post<CustomResource>(`${this.getEndpoints(endpoints).resourceAbstractorUrl}/api/v1/custom-resources`, resource);
    }

    deleteCustomResource(resourceType: string, endpoints?: Partial<AddonsEndpoints>): Observable<void> {
        return this.http.delete<void>(`${this.getEndpoints(endpoints).resourceAbstractorUrl}/api/v1/custom-resources/${resourceType}`);
    }

    getResourcesByType(resourceType: string, filters?: Record<string, string>, endpoints?: Partial<AddonsEndpoints>): Observable<unknown[]> {
        let params = new HttpParams();
        const activeFilters = filters || {};
        Object.keys(activeFilters).forEach((key) => {
            const value = activeFilters[key];
            if (value) {
                params = params.set(key, value);
            }
        });
        return this.http.get<unknown[]>(`${this.getEndpoints(endpoints).resourceAbstractorUrl}/api/v1/custom-resources/${resourceType}`, {
            params,
        });
    }

    createResourceInstance(resourceType: string, data: unknown, endpoints?: Partial<AddonsEndpoints>): Observable<unknown> {
        return this.http.post<unknown>(`${this.getEndpoints(endpoints).resourceAbstractorUrl}/api/v1/custom-resources/${resourceType}`, data);
    }

    updateResourceInstance(resourceType: string, id: string, data: unknown, endpoints?: Partial<AddonsEndpoints>): Observable<unknown> {
        return this.http.patch<unknown>(`${this.getEndpoints(endpoints).resourceAbstractorUrl}/api/v1/custom-resources/${resourceType}/${id}`, data);
    }

    deleteResourceInstance(resourceType: string, id: string, endpoints?: Partial<AddonsEndpoints>): Observable<void> {
        return this.http.delete<void>(`${this.getEndpoints(endpoints).resourceAbstractorUrl}/api/v1/custom-resources/${resourceType}/${id}`);
    }

    checkAvailability(): Observable<{ addons: boolean; customResources: boolean; marketplaceUi: boolean }> {
        return forkJoin({
            marketplace: this.ping(this.endpoints.marketplaceUrl),
            engine: this.ping(this.endpoints.addonsEngineUrl),
            resourceAbstractor: this.ping(this.endpoints.resourceAbstractorUrl),
            marketplaceUi: this.ping(this.endpoints.marketplaceUiUrl),
        }).pipe(
            map(({ marketplace, engine, resourceAbstractor, marketplaceUi }) => {
                return {
                    addons: marketplace && engine,
                    customResources: resourceAbstractor,
                    marketplaceUi,
                };
            }),
            catchError(() => of({ addons: false, customResources: false, marketplaceUi: false })),
        );
    }

    private getApiRoot(): URL {
        try {
            return new URL(environment.apiUrl);
        } catch {
            return new URL('http://localhost:10000/api');
        }
    }

    private getEndpoints(overrides?: Partial<AddonsEndpoints>): AddonsEndpoints {
        return { ...this.getRootEndpoints(), ...this.endpointOverrides, ...overrides };
    }

    private getClusterHost(cluster: Partial<ICluster> | undefined, fallbackHost: string): string {
        const host =
            cluster?.ip ||
            cluster?.cluster_ip ||
            cluster?.public_ip ||
            cluster?.node_ip ||
            cluster?.host ||
            cluster?.hostname ||
            cluster?.address ||
            cluster?.cluster_address ||
            '';

        if (!host) {
            return '';
        }

        if (this.isDockerBridgeHost(host)) {
            return fallbackHost;
        }

        try {
            const hostname = new URL(host.includes('://') ? host : `http://${host}`).hostname;
            return this.isDockerBridgeHost(hostname) ? fallbackHost : hostname;
        } catch {
            const hostname = host.split(':')[0];
            return this.isDockerBridgeHost(hostname) ? fallbackHost : hostname;
        }
    }

    private isDockerBridgeHost(host: string): boolean {
        return /^172\.(1[6-9]|2\d|3[0-1])\./.test(host);
    }

    private ping(url: string): Observable<boolean> {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);

        return from(fetch(url, { mode: 'no-cors', signal: controller.signal })).pipe(
            map(() => true),
            catchError(() => of(false)),
            map((available) => {
                clearTimeout(timeout);
                return available;
            }),
        );
    }
}
