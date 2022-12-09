import { ActionReducerMap } from '@ngrx/store';
import * as fromService from './service.reducer';
import * as fromUser from './user.reducer';
import * as fromApplication from './application.reducer';

export interface AppState {
    service: fromService.State;
    user: fromUser.State;
    applications: fromApplication.State;
}

export const reducers: ActionReducerMap<AppState> = {
    service: fromService.serviceReducer,
    user: fromUser.userReducer,
    applications: fromApplication.applicationReducer,
};
