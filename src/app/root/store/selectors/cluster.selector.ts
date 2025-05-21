import { createSelector } from '@ngrx/store';
import * as fromCluster from '../reducers/cluster.reducer';
import * as fromApp from '../reducers/app.reducer';

const clusterSelector = (state: fromApp.AppState) => state.clusters;

export const selectAllClusters = createSelector(clusterSelector, (state: fromCluster.State) => state.clusters);
