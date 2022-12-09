import { Action, createReducer, on } from '@ngrx/store';
import { IApplication } from '../../interfaces/application';
import * as applicationActions from '../actions/application.action';

export const userFeatureKey = 'user';

export interface State {
    applications: IApplication[];
    loading: boolean;
    error: unknown;
}

export const initialState: State = {
    applications: [],
    loading: false,
    error: {},
};

export const applicationReducer = createReducer(
    initialState,

    on(applicationActions.getApplicationSuccess, (state, action) => {
        const applications = action.applications;
        const loading = false;
        return { ...state, applications, loading };
    }),
    on(applicationActions.getApplication, (state) => {
        const applications = [] as IApplication[];
        const loading = true;
        return { ...state, applications, loading };
    }),

    on(applicationActions.getApplicationError, (state, action) => {
        const applications = [] as IApplication[];
        const loading = false;
        const error = action.error;
        return { ...state, applications, loading, error };
    }),
);

export function reducer(state: State, action: Action) {
    return applicationReducer(state, action);
}
