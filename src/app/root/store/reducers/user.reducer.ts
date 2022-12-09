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

    on(userActions.userLoaded, (state, action) => {
        const user = action.user;
        const loading = false;
        return { ...state, user, loading };
    }),
    on(userActions.loadUser, (state) => {
        const user = {} as IUser;
        const loading = true;
        return { ...state, user, loading };
    }),

    on(userActions.loadUserError, (state, action) => {
        const services = {} as IUser;
        const loading = false;
        const error = action.error;
        return { ...state, services, loading, error };
    }),
);

export function reducer(state: State, action: Action) {
    return userReducer(state, action);
}
