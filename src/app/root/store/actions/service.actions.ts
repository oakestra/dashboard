import { createAction, props } from '@ngrx/store';
import { IService } from '../../interfaces/service';

export const loadServices = createAction('[Service] loadServices');

export const servicesLoaded = createAction('[Service] servicesLoaded', props<{ service: IService }>());

export const loadServicesError = createAction('[Service] loadServicesError', props<{ error: string }>());
