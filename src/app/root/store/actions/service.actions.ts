import { createAction, props } from '@ngrx/store';
import { IService } from '../../interfaces/service';

// //////////// GET /////////////
export const getServices = createAction('[Service] getServices');
export const getServicesSuccess = createAction('[Service] getServicesSuccess', props<{ service: IService }>());
export const getServicesError = createAction('[Service] getServicesError', props<{ error: string }>());

// ////////////// POST ////////////////////
export const postService = createAction('[Service] postService', props<{ service: IService }>());
export const postServiceSuccess = createAction('[Service] postServiceSuccess', props<{ service: IService }>());
export const postServiceError = createAction('[Service] postServiceError', props<{ error: string }>());

// ////////////// UPDATE ////////////////////
export const updateService = createAction('[Service] updateService', props<{ service: IService }>());
export const updateServiceSuccess = createAction('[Service] updateServiceSuccess', props<{ service: IService }>());
export const updateServiceError = createAction('[Service] updateServiceError', props<{ error: string }>());

// ///////////// DELETE /////////////
export const deleteService = createAction('[Service] deleteService', props<{ service: IService }>());
export const deleteServiceSuccess = createAction('[Service] deleteServiceSuccess', props<{ service: IService }>());
export const deleteServiceError = createAction('[Service] deleteServiceError', props<{ error: string }>());
