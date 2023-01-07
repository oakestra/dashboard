import { createSelector } from '@ngrx/store';
import * as fromApplication from '../reducers/application.reducer';
import * as fromApp from '../reducers/app.reducer';

const applicationSelector = (state: fromApp.AppState) => state.applications;

export const selectApplications = createSelector(
    applicationSelector,
    (state: fromApplication.State) => state.applications,
);

export const selectCurrentApplication = createSelector(
    applicationSelector,
    (state: fromApplication.State) => state.currentApplication,
);
