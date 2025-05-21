import { createAction, props } from '@ngrx/store';
import { ICluster } from '../../interfaces/cluster';

// //////////////// GET ALL ///////////////////////

export const getActiveClusters = createAction('[Cluster] getActiveClusters');
export const getClusters= createAction('[Cluster] getClusters');
export const getClustersSuccess= createAction('[Cluster] getClustersSuccess', props<{ clusterList: ICluster[] }>());
export const getClustersError= createAction('[Cluster] getClustersError', props<{  error: string }>());

