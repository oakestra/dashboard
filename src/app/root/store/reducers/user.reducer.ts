import { Action, createReducer, on } from '@ngrx/store';
import * as userActions from '../actions/user.actions';
import { IUser } from '../../interfaces/user';

export const userFeatureKey = 'user';

export interface State {
    currentUser: IUser;
    users: IUser[];
    loading: boolean;
    error: unknown;
}

export const initialState: State = {
    currentUser: null,
    users: [],
    loading: false,
    error: {},
};

export const userReducer = createReducer(
    initialState,
    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  GET USER  ///////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(userActions.getUser, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(userActions.getUserSuccess, (state, action) => {
        const currentUser = action.currentUser;
        const loading = false;
        return { ...state, currentUser, loading };
    }),

    on(userActions.getUserError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  POST USER  ///////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(userActions.postUser, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(userActions.postUserSuccess, (state, action) => {
        const users = [...state.users, action.user];
        const loading = false;
        return { ...state, users, loading };
    }),

    on(userActions.postUserError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  UPDATE USER  ///////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(userActions.updateUser, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    // TODO Fix this
    on(userActions.updateUserSuccess, (state, action) => {
        const user = action.user;
        const loading = false;
        return { ...state, user, loading };
    }),

    on(userActions.updateUserError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  DELETE USER  ///////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(userActions.deleteUser, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(userActions.deleteUserSuccess, (state, action) => {
        const users = state.users.filter((user) => user !== action.user);
        const loading = false;
        return { ...state, users, loading };
    }),

    on(userActions.deleteUserError, (state, action) => {
        const user = {} as IUser;
        const loading = false;
        const error = action.error;
        return { ...state, user, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  GET ALL USER  ///////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(userActions.getAllUser, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(userActions.getAllUserSuccess, (state, action) => {
        const users = action.users;
        const loading = false;
        return { ...state, users, loading };
    }),

    on(userActions.getAllUserError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),
);

export function reducer(state: State, action: Action) {
    return userReducer(state, action);
}
