import { createAction, props } from '@ngrx/store';
import { IUser } from '../../interfaces/user';

export const loadUser = createAction('[User] loadUser', props<{ name: string }>());

export const userLoaded = createAction('[User] userLoaded', props<{ user: IUser }>());

export const loadUserError = createAction('[User] loadUserError', props<{ error: string }>());
