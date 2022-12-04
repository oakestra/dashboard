import { ActionReducerMap } from '@ngrx/store';
import * as fromService from './service.reducer';

export interface AppState {
    service: fromService.ServiceState;
}

export const reducers: ActionReducerMap<AppState> = {
    service: fromService.serviceReducer,
};
