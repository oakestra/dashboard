import { createAction, props } from '@ngrx/store';
import { AddonsEndpoints, CustomResource, Hook, InstalledAddon, MarketplaceAddon } from '../../interfaces/addon';

export const checkAddonsAvailability = createAction('[Addons] check availability');
export const checkAddonsAvailabilitySuccess = createAction(
    '[Addons] check availability success',
    props<{ addonsAvailable: boolean; customResourcesAvailable: boolean }>(),
);
export const checkAddonsAvailabilityError = createAction('[Addons] check availability error');

export const loadMarketplaceAddons = createAction('[Addons] load marketplace addons');
export const loadMarketplaceAddonsSuccess = createAction(
    '[Addons] load marketplace addons success',
    props<{ addons: MarketplaceAddon[] }>(),
);
export const loadMarketplaceAddonsError = createAction(
    '[Addons] load marketplace addons error',
    props<{ error: string }>(),
);

export const createMarketplaceAddon = createAction(
    '[Addons] create marketplace addon',
    props<{ addon: MarketplaceAddon }>(),
);
export const deleteMarketplaceAddon = createAction(
    '[Addons] delete marketplace addon',
    props<{ id: string }>(),
);

export const loadInstalledAddons = createAction(
    '[Addons] load installed addons',
    props<{ status?: string; endpoints?: Partial<AddonsEndpoints> }>(),
);
export const loadInstalledAddonsSuccess = createAction(
    '[Addons] load installed addons success',
    props<{ addons: InstalledAddon[] }>(),
);
export const loadInstalledAddonsError = createAction(
    '[Addons] load installed addons error',
    props<{ error: string }>(),
);

export const installAddon = createAction(
    '[Addons] install addon',
    props<{
        marketplaceId: string;
        endpoints?: Partial<AddonsEndpoints>;
        reloadInstalled?: boolean;
        refreshEndpoints?: Partial<AddonsEndpoints>;
    }>(),
);
export const installAddonSuccess = createAction('[Addons] install addon success');
export const disableAddon = createAction('[Addons] disable addon', props<{ id: string; endpoints?: Partial<AddonsEndpoints> }>());

export const loadHooks = createAction('[Addons] load hooks', props<{ endpoints?: Partial<AddonsEndpoints> }>());
export const loadHooksSuccess = createAction('[Addons] load hooks success', props<{ hooks: Hook[] }>());
export const loadHooksError = createAction('[Addons] load hooks error', props<{ error: string }>());
export const createHook = createAction('[Addons] create hook', props<{ hook: Hook; endpoints?: Partial<AddonsEndpoints> }>());
export const deleteHook = createAction('[Addons] delete hook', props<{ id: string; endpoints?: Partial<AddonsEndpoints> }>());

export const loadCustomResources = createAction('[Addons] load custom resources', props<{ endpoints?: Partial<AddonsEndpoints> }>());
export const loadCustomResourcesSuccess = createAction(
    '[Addons] load custom resources success',
    props<{ resources: CustomResource[] }>(),
);
export const loadCustomResourcesError = createAction('[Addons] load custom resources error', props<{ error: string }>());
export const createCustomResource = createAction(
    '[Addons] create custom resource',
    props<{ resource: CustomResource; endpoints?: Partial<AddonsEndpoints> }>(),
);
export const deleteCustomResource = createAction(
    '[Addons] delete custom resource',
    props<{ resourceType: string; endpoints?: Partial<AddonsEndpoints> }>(),
);

export const selectCustomResourceType = createAction('[Addons] select custom resource type', props<{ resourceType: string }>());
export const loadResourceInstances = createAction(
    '[Addons] load resource instances',
    props<{ resourceType: string; filters?: Record<string, string>; endpoints?: Partial<AddonsEndpoints> }>(),
);
export const loadResourceInstancesSuccess = createAction(
    '[Addons] load resource instances success',
    props<{ resourceType: string; instances: unknown[] }>(),
);
export const loadResourceInstancesError = createAction('[Addons] load resource instances error', props<{ error: string }>());
export const createResourceInstance = createAction(
    '[Addons] create resource instance',
    props<{ resourceType: string; data: unknown; endpoints?: Partial<AddonsEndpoints> }>(),
);
export const updateResourceInstance = createAction(
    '[Addons] update resource instance',
    props<{ resourceType: string; id: string; data: unknown; endpoints?: Partial<AddonsEndpoints> }>(),
);
export const deleteResourceInstance = createAction(
    '[Addons] delete resource instance',
    props<{ resourceType: string; id: string; endpoints?: Partial<AddonsEndpoints> }>(),
);
