import { createAction, props } from '@ngrx/store';
import { IService } from '../../interfaces/service';

export const getServices = createAction('[Service] getServices');

export const getServicesSuccess = createAction('[Service] getServicesSuccess', props<{ service: IService }>());

export const getServicesError = createAction('[Service] getServicesError', props<{ error: string }>());
