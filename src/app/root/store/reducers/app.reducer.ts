import { ActionReducerMap } from '@ngrx/store';
import * as fromService from './service.reducer';
import * as fromUser from './user.reducer';
import * as fromApplication from './application.reducer';
import * as fromSettings from './settings.reducer';

export interface AppState {
    services: fromService.State;
    user: fromUser.State;
    applications: fromApplication.State;
    settings: fromSettings.State;
}

export const reducers: ActionReducerMap<AppState> = {
    services: fromService.serviceReducer,
    user: fromUser.userReducer,
    applications: fromApplication.applicationReducer,
    settings: fromSettings.settingsReducer,
};
