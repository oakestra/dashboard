import { createAction, props } from '@ngrx/store';
import { IOrganization } from '../../interfaces/organization';

// //////////// GET ALL /////////////
export const getOrganization = createAction('[Organization] getOrganization');
export const getOrganizationSuccess = createAction(
    '[Organizations getOrganizationSuccess',
    props<{ organizations: IOrganization[] }>(),
);
export const getOrganizationError = createAction('[Organizations getOrganizationError', props<{ error: string }>());

// ///////////// DELETE /////////////
export const deleteOrganization = createAction(
    '[Organization] deleteOrganization',
    props<{ organization: IOrganization }>(),
);
export const deleteOrganizationSuccess = createAction(
    '[Organization] deleteOrganizationSuccess',
    props<{ organization: IOrganization }>(),
);
export const deleteOrganizationError = createAction(
    '[Organization] deleteOrganizationError',
    props<{ error: string }>(),
);

// ////////////// UPDATE ////////////////////
export const updateOrganization = createAction(
    '[Organization] updateOrganization',
    props<{ organization: IOrganization }>(),
);
export const updateOrganizationSuccess = createAction(
    '[Organization] updateOrganizationSuccess',
    props<{ organization: IOrganization }>(),
);
export const updateOrganizationError = createAction(
    '[Organization] updateOrganizationError',
    props<{ error: string }>(),
);

// ////////////// POST ////////////////////
export const postOrganization = createAction(
    '[Organization] postOrganization',
    props<{ organization: IOrganization }>(),
);
export const postOrganizationSuccess = createAction(
    '[Organization] postOrganizationSuccess',
    props<{ organization: IOrganization; id: string }>(),
);
export const postOrganizationError = createAction('[Organization] postOrganizationError', props<{ error: string }>());

// ////////////// RESET STATE ////////////////////
export const resetOrganization = createAction('[Organization] resetOrganization');
