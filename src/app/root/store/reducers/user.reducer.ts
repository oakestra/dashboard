import { Action, createReducer, on } from '@ngrx/store';
import * as userActions from '../actions/user.actions';
import { IUser } from '../../interfaces/user';

export const userFeatureKey = 'user';

export interface State {
    user: IUser;
    loading: boolean;
    error: unknown;
}

export const initialState: State = {
    user: null,
    loading: false,
    error: {},
};

export const userReducer = createReducer(
    initialState,
    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  GET APPLICATION  ///////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(userActions.getUser, (state) => {
        const user = {} as IUser;
        const loading = true;
        return { ...state, user, loading };
    }),

    on(userActions.getUserSuccess, (state, action) => {
        const user = action.user;
        const loading = false;
        return { ...state, user, loading };
    }),

    on(userActions.getUserError, (state, action) => {
        const user = {} as IUser;
        const loading = false;
        const error = action.error;
        return { ...state, user, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  POST APPLICATION  ///////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(userActions.postUser, (state) => {
        const user = {} as IUser;
        const loading = true;
        return { ...state, user, loading };
    }),

    on(userActions.postUserSuccess, (state, action) => {
        const user = action.user;
        const loading = false;
        return { ...state, user, loading };
    }),

    on(userActions.postUserError, (state, action) => {
        const user = {} as IUser;
        const loading = false;
        const error = action.error;
        return { ...state, user, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  UPDATE APPLICATION  ///////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(userActions.updateUser, (state) => {
        const user = {} as IUser;
        const loading = true;
        return { ...state, user, loading };
    }),

    on(userActions.updateUserSuccess, (state, action) => {
        const user = action.user;
        const loading = false;
        return { ...state, user, loading };
    }),

    on(userActions.updateUserError, (state, action) => {
        const user = {} as IUser;
        const loading = false;
        const error = action.error;
        return { ...state, user, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  DELETE APPLICATION  ///////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(userActions.deleteUser, (state) => {
        const user = {} as IUser;
        const loading = true;
        return { ...state, user, loading };
    }),

    on(userActions.deleteUserSuccess, (state, action) => {
        const user = action.user;
        const loading = false;
        return { ...state, user, loading };
    }),

    on(userActions.deleteUserError, (state, action) => {
        const user = {} as IUser;
        const loading = false;
        const error = action.error;
        return { ...state, user, loading, error };
    }),
);

export function reducer(state: State, action: Action) {
    return userReducer(state, action);
}
