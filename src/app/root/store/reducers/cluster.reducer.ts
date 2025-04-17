import { Action, createReducer, on } from '@ngrx/store';
import { ICluster } from '../../interfaces/cluster';
import * as clusterActions from '../actions/cluster.actions';

export const userFeatureKey = 'cluster';

export interface State {
    currentCluster: ICluster;
    clusters: ICluster[];
    loading: boolean;
    error: unknown;
}

export const initialState: State = {
    currentCluster: null,
    clusters: [],
    loading: false,
    error: {},
};

export const clusterReducer = createReducer(
    initialState,
    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  GET Clusters  ///////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////
    on(clusterActions.getActiveClusters, (state) => {
        const clusters = [] as ICluster[];
        const loading = true;
        return { ...state, clusters, loading };
    }),

    on(clusterActions.getClustersSuccess, (state, action) => {
        const clusters = action.clusterList;
        const loading = false;
        return { ...state, clusters, loading };
    }),

    on(clusterActions.getClustersError, (state, action) => {
        const applications = [] as ICluster[];
        const loading = false;
        const error = action.error;
        return { ...state, applications, loading, error };
    }),

);

export function reducer(state: State, action: Action) {
    return clusterReducer(state, action);
}
