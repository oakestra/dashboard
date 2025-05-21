import { ActionReducerMap } from '@ngrx/store';
import * as fromService from './service.reducer';
import * as fromUser from './user.reducer';
import * as fromApplication from './application.reducer';
import * as fromOrganization from './organization.reducer';
import * as fromSettings from './settings.reducer';
import * as fromCluster from './cluster.reducer';


export interface AppState {
    services: fromService.State;
    user: fromUser.State;
    applications: fromApplication.State;
    organizations: fromOrganization.State;
    settings: fromSettings.State;
    clusters: fromCluster.State;
}

export const reducers: ActionReducerMap<AppState> = {
    services: fromService.serviceReducer,
    user: fromUser.userReducer,
    applications: fromApplication.applicationReducer,
    organizations: fromOrganization.organizationReducer,
    settings: fromSettings.settingsReducer,
    clusters: fromCluster.clusterReducer,
};
