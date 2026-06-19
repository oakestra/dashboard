import { createSelector } from '@ngrx/store';
import * as fromAddons from '../reducers/addons.reducer';
import * as fromApp from '../reducers/app.reducer';

const addonsSelector = (state: fromApp.AppState) => state.addons;

export const selectAddonsAvailable = createSelector(addonsSelector, (state: fromAddons.State) => state.addonsAvailable);
export const selectCustomResourcesAvailable = createSelector(
    addonsSelector,
    (state: fromAddons.State) => state.customResourcesAvailable,
);
export const selectMarketplaceAddons = createSelector(addonsSelector, (state: fromAddons.State) => state.marketplaceAddons);
export const selectInstalledAddons = createSelector(addonsSelector, (state: fromAddons.State) => state.installedAddons);
export const selectHooks = createSelector(addonsSelector, (state: fromAddons.State) => state.hooks);
export const selectCustomResources = createSelector(addonsSelector, (state: fromAddons.State) => state.customResources);
export const selectSelectedResourceType = createSelector(addonsSelector, (state: fromAddons.State) => state.selectedResourceType);
export const selectResourceInstances = createSelector(addonsSelector, (state: fromAddons.State) => state.resourceInstances);
export const selectAddonsLoading = createSelector(addonsSelector, (state: fromAddons.State) => state.loading);
export const selectAddonsError = createSelector(addonsSelector, (state: fromAddons.State) => state.error);
