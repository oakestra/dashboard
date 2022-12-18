import { createAction, props } from '@ngrx/store';
import { IUser } from '../../interfaces/user';

// //////////////// GET ///////////////////////

export const getUser = createAction('[User] getUser', props<{ name: string }>());

export const getUserSuccess = createAction('[User] getUserSuccess', props<{ user: IUser }>());

export const getUserError = createAction('[User] getUserError', props<{ error: string }>());

// //////////////// POST ///////////////////////

export const postUser = createAction('[User] getUser', props<{ user: IUser }>());

export const postUserSuccess = createAction('[User] getUserSuccess', props<{ user: IUser }>());

export const postUserError = createAction('[User] getUserError', props<{ error: string }>());

// //////////////// UPDATE ///////////////////////

export const updateUser = createAction('[User] updateUser', props<{ user: IUser }>());

export const updateUserSuccess = createAction('[User] updateUserSuccess', props<{ user: IUser }>());

export const updateUserError = createAction('[User] updateUserError', props<{ error: string }>());

// //////////////// DELETE ///////////////////////

export const deleteUser = createAction('[User] deleteUser', props<{ user: IUser }>());

export const deleteUserSuccess = createAction('[User] deleteUserSuccess', props<{ user: IUser }>());

export const deleteUserError = createAction('[User] deleteUserError', props<{ error: string }>());
