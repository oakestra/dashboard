import { createSelector } from '@ngrx/store';
import * as fromService from '../reducers/service.reducer';
import * as fromApp from '../reducers/app.reducer';

const selectService = (state: fromApp.AppState) => state.service;

export const selectCurrentService = createSelector(selectService, (state: fromService.ServiceState) => state.service);

/*

export const isLoadingSelector = createSelector(selectFeature, (state) => state.isLoading);

export const postsSelector = createSelector(selectFeature, (state) => state.services);

export const errorSelector = createSelector(selectFeature, (state) => state.error);
*/
