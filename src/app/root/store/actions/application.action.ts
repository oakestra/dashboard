import { createAction, props } from '@ngrx/store';
import { IApplication } from '../../interfaces/application';

export const getApplication = createAction('[User] getApplication', props<{ id: string }>());

export const getApplicationSuccess = createAction(
    '[User] getApplicationSuccess',
    props<{ applications: IApplication[] }>(),
);

export const getApplicationError = createAction('[User] getApplicationError', props<{ error: string }>());
