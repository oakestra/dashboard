import { createSelector } from '@ngrx/store';
import * as fromSettings from '../reducers/settings.reducer';
import * as fromApp from '../reducers/app.reducer';

const settingsSelector = (state: fromApp.AppState) => state.settings;

export const selectSettings = createSelector(settingsSelector, (state: fromSettings.State) => state.settings);
