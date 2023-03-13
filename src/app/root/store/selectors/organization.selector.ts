import { createSelector } from '@ngrx/store';
import * as fromOrganization from '../reducers/organization.reducer';
import * as fromApp from '../reducers/app.reducer';

const organizationSelector = (state: fromApp.AppState) => state.organizations;

export const selectOrganization = createSelector(
    organizationSelector,
    (state: fromOrganization.State) => state.organizations,
);
