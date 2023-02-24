import { createAction, props } from '@ngrx/store';
import { IService } from '../../interfaces/service';
import { ISla } from '../../interfaces/sla';

// //////////// GET Services of APP /////////////
export const getServices = createAction('[Service] getServices', props<{ appId: string }>());
export const getServicesSuccess = createAction('[Service] getServicesSuccess', props<{ services: IService[] }>());
export const getServicesError = createAction('[Service] getServicesError', props<{ error: string }>());

// ////////////// POST ////////////////////
export const postService = createAction('[Service] postService', props<{ service: ISla }>());
export const postServiceSuccess = createAction(
    '[Service] postServiceSuccess',
    props<{ service: ISla; serviceId: string }>(),
);
export const postServiceError = createAction('[Service] postServiceError', props<{ error: string }>());

// ////////////// UPDATE ////////////////////
export const updateService = createAction('[Service] updateService', props<{ service: IService }>());
export const updateServiceSuccess = createAction('[Service] updateServiceSuccess', props<{ service: IService }>());
export const updateServiceError = createAction('[Service] updateServiceError', props<{ error: string }>());

// ///////////// DELETE /////////////
export const deleteService = createAction('[Service] deleteService', props<{ service: IService }>());
export const deleteServiceSuccess = createAction('[Service] deleteServiceSuccess', props<{ service: IService }>());
export const deleteServiceError = createAction('[Service] deleteServiceError', props<{ error: string }>());
