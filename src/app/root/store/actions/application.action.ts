import { createAction, props } from '@ngrx/store';
import { IApplication } from '../../interfaces/application';

// //////////// GET BY USER /////////////
export const getApplication = createAction('[Application] getApplication', props<{ id: string }>());
export const getApplicationSuccess = createAction(
    '[Application] getApplicationSuccess',
    props<{ applications: IApplication[] }>(),
);
export const getApplicationError = createAction('[Application] getApplicationError', props<{ error: string }>());

// ///////////// DELETE /////////////

export const deleteApplication = createAction(
    '[Application] deleteApplication',
    props<{ application: IApplication }>(),
);
export const deleteApplicationSuccess = createAction(
    '[Application] deleteApplicationSuccess',
    props<{ application: IApplication }>(),
);
export const deleteApplicationError = createAction('[Application] deleteApplicationError', props<{ error: string }>());

// ////////////// UPDATE ////////////////////
export const updateApplication = createAction(
    '[Application] updateApplication',
    props<{ application: IApplication }>(),
);
export const updateApplicationSuccess = createAction(
    '[Application] updateApplicationSuccess',
    props<{ application: IApplication }>(),
);
export const updateApplicationError = createAction('[Application] updateApplicationError', props<{ error: string }>());

// ////////////// POST ////////////////////
export const postApplication = createAction('[Application] postApplication', props<{ application: IApplication }>());
export const postApplicationSuccess = createAction(
    '[Application] postApplicationSuccess',
    props<{ application: IApplication }>(),
);
export const postApplicationError = createAction('[Application] postApplicationError', props<{ error: string }>());

// ////////////// SET CURRENT ////////////////////
export const setCurrentApplication = createAction(
    '[Application] setCurrentApplication',
    props<{ application: IApplication }>(),
);

// ////////////// RESET STATE ////////////////////
export const resetApplication = createAction('[Application] resetApplication');
