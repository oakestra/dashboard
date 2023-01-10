import { createSelector } from '@ngrx/store';
import * as fromService from '../reducers/service.reducer';
import * as fromApp from '../reducers/app.reducer';

const selectService = (state: fromApp.AppState) => state.services;

export const selectCurrentServices = createSelector(selectService, (state: fromService.State) => state.servicesOfApp);
