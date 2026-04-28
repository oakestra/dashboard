import { Action, createReducer, on } from '@ngrx/store';
import { CustomResource, Hook, InstalledAddon, MarketplaceAddon } from '../../interfaces/addon';
import * as addonsActions from '../actions/addons.actions';

export const addonsFeatureKey = 'addons';

export interface State {
    addonsAvailable: boolean;
    customResourcesAvailable: boolean;
    marketplaceAddons: MarketplaceAddon[];
    installedAddons: InstalledAddon[];
    hooks: Hook[];
    customResources: CustomResource[];
    selectedResourceType: string;
    resourceInstances: unknown[];
    loading: boolean;
    error: string;
}

export const initialState: State = {
    addonsAvailable: false,
    customResourcesAvailable: false,
    marketplaceAddons: [],
    installedAddons: [],
    hooks: [],
    customResources: [],
    selectedResourceType: '',
    resourceInstances: [],
    loading: false,
    error: '',
};

export const addonsReducer = createReducer(
    initialState,
    on(addonsActions.checkAddonsAvailabilitySuccess, (state, action) => {
        return {
            ...state,
            addonsAvailable: action.addonsAvailable,
            customResourcesAvailable: action.customResourcesAvailable,
        };
    }),
    on(addonsActions.checkAddonsAvailabilityError, (state) => {
        return {
            ...state,
            addonsAvailable: false,
            customResourcesAvailable: false,
        };
    }),
    on(
        addonsActions.loadMarketplaceAddons,
        addonsActions.loadInstalledAddons,
        addonsActions.loadHooks,
        addonsActions.loadCustomResources,
        addonsActions.loadResourceInstances,
        (state) => {
            return { ...state, loading: true, error: '' };
        },
    ),
    on(addonsActions.loadMarketplaceAddonsSuccess, (state, action) => {
        return {
            ...state,
            marketplaceAddons: action.addons,
            loading: false,
        };
    }),
    on(addonsActions.loadInstalledAddonsSuccess, (state, action) => {
        return {
            ...state,
            installedAddons: action.addons,
            loading: false,
        };
    }),
    on(addonsActions.loadHooksSuccess, (state, action) => {
        return {
            ...state,
            hooks: action.hooks,
            loading: false,
        };
    }),
    on(addonsActions.loadCustomResourcesSuccess, (state, action) => {
        return {
            ...state,
            customResources: action.resources,
            selectedResourceType: state.selectedResourceType || action.resources[0]?.resource_type || '',
            loading: false,
        };
    }),
    on(addonsActions.selectCustomResourceType, (state, action) => {
        return {
            ...state,
            selectedResourceType: action.resourceType,
            resourceInstances: [] as any[],
        };
    }),
    on(addonsActions.loadResourceInstancesSuccess, (state, action) => {
        return {
            ...state,
            selectedResourceType: action.resourceType,
            resourceInstances: action.instances,
            loading: false,
        };
    }),
    on(
        addonsActions.loadMarketplaceAddonsError,
        addonsActions.loadInstalledAddonsError,
        addonsActions.loadHooksError,
        addonsActions.loadCustomResourcesError,
        addonsActions.loadResourceInstancesError,
        (state, action) => {
            return { ...state, loading: false, error: action.error };
        },
    ),
);

export function reducer(state: State, action: Action) {
    return addonsReducer(state, action);
}
