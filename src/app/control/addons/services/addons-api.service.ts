import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AddonsEndpoints, CustomResource, Hook, InstalledAddon, MarketplaceAddon } from 'src/app/root/interfaces/addon';

@Injectable({
    providedIn: 'root',
})
export class AddonsApiService {
    private endpointOverrides: Partial<AddonsEndpoints> = {};

    constructor(private http: HttpClient) {}

    get endpoints(): AddonsEndpoints {
        const root = this.getApiRoot();
        const env = (window as unknown as { env?: Record<string, string> }).env || {};

        const defaults = {
            marketplaceUrl: env.MARKETPLACE_URL || `${root.protocol}//${root.hostname}:11102`,
            addonsEngineUrl: env.ADDONS_ENGINE_URL || `${root.protocol}//${root.hostname}:11101`,
            resourceAbstractorUrl: env.RESOURCE_ABSTRACTOR_URL || `${root.protocol}//${root.hostname}:11011`,
            marketplaceUiUrl: env.ADDONS_DASHBOARD_URL || `${root.protocol}//${root.hostname}:11103`,
        };

        return { ...defaults, ...this.endpointOverrides };
    }

    setEndpointOverrides(overrides: Partial<AddonsEndpoints>): void {
        this.endpointOverrides = overrides;
    }

    clearEndpointOverrides(): void {
        this.endpointOverrides = {};
    }

    getMarketplaceAddons(): Observable<MarketplaceAddon[]> {
        return this.http.get<MarketplaceAddon[]>(`${this.endpoints.marketplaceUrl}/api/v1/marketplace/addons`);
    }

    createMarketplaceAddon(addon: MarketplaceAddon): Observable<MarketplaceAddon> {
        return this.http.post<MarketplaceAddon>(`${this.endpoints.marketplaceUrl}/api/v1/marketplace/addons`, addon);
    }

    deleteMarketplaceAddon(id: string): Observable<void> {
        return this.http.delete<void>(`${this.endpoints.marketplaceUrl}/api/v1/marketplace/addons/${id}`);
    }

    getInstalledAddons(query?: Record<string, string>): Observable<InstalledAddon[]> {
        let params = new HttpParams();
        const filters = query || {};
        Object.keys(filters).forEach((key) => {
            const value = filters[key];
            if (value) {
                params = params.set(key, value);
            }
        });
        return this.http.get<InstalledAddon[]>(`${this.endpoints.addonsEngineUrl}/api/v1/addons`, { params });
    }

    installAddon(marketplaceId: string): Observable<InstalledAddon> {
        return this.http.post<InstalledAddon>(`${this.endpoints.addonsEngineUrl}/api/v1/addons`, {
            marketplace_id: marketplaceId,
        });
    }

    disableAddon(id: string): Observable<InstalledAddon> {
        return this.http.delete<InstalledAddon>(`${this.endpoints.addonsEngineUrl}/api/v1/addons/${id}`);
    }

    getHooks(): Observable<Hook[]> {
        return this.http.get<Hook[]>(`${this.endpoints.resourceAbstractorUrl}/api/v1/hooks`);
    }

    createHook(hook: Hook): Observable<Hook> {
        return this.http.post<Hook>(`${this.endpoints.resourceAbstractorUrl}/api/v1/hooks`, hook);
    }

    deleteHook(id: string): Observable<void> {
        return this.http.delete<void>(`${this.endpoints.resourceAbstractorUrl}/api/v1/hooks/${id}`);
    }

    getCustomResources(): Observable<CustomResource[]> {
        return this.http.get<CustomResource[]>(`${this.endpoints.resourceAbstractorUrl}/api/v1/custom-resources`);
    }

    createCustomResource(resource: CustomResource): Observable<CustomResource> {
        return this.http.post<CustomResource>(`${this.endpoints.resourceAbstractorUrl}/api/v1/custom-resources`, resource);
    }

    deleteCustomResource(resourceType: string): Observable<void> {
        return this.http.delete<void>(`${this.endpoints.resourceAbstractorUrl}/api/v1/custom-resources/${resourceType}`);
    }

    getResourcesByType(resourceType: string, filters?: Record<string, string>): Observable<unknown[]> {
        let params = new HttpParams();
        const activeFilters = filters || {};
        Object.keys(activeFilters).forEach((key) => {
            const value = activeFilters[key];
            if (value) {
                params = params.set(key, value);
            }
        });
        return this.http.get<unknown[]>(`${this.endpoints.resourceAbstractorUrl}/api/v1/custom-resources/${resourceType}`, {
            params,
        });
    }

    createResourceInstance(resourceType: string, data: unknown): Observable<unknown> {
        return this.http.post<unknown>(`${this.endpoints.resourceAbstractorUrl}/api/v1/custom-resources/${resourceType}`, data);
    }

    updateResourceInstance(resourceType: string, id: string, data: unknown): Observable<unknown> {
        return this.http.patch<unknown>(`${this.endpoints.resourceAbstractorUrl}/api/v1/custom-resources/${resourceType}/${id}`, data);
    }

    deleteResourceInstance(resourceType: string, id: string): Observable<void> {
        return this.http.delete<void>(`${this.endpoints.resourceAbstractorUrl}/api/v1/custom-resources/${resourceType}/${id}`);
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
