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

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  GET APPLICATION  ///////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

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

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  DELETE APPLICATION  ////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////
    on(applicationActions.deleteApplicationSuccess, (state, action) => {
        const applications = state.applications.filter((app) => app !== action.application);
        const loading = false;
        return { ...state, applications, loading };
    }),
    on(applicationActions.deleteApplication, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(applicationActions.deleteApplicationError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  UPDATE APPLICATION  ////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////
    // TODO
    on(applicationActions.updateApplicationSuccess, (state, action) => {
        console.log(action);
        const applications = state.applications;
        const loading = false;
        return { ...state, applications, loading };
    }),
    on(applicationActions.updateApplication, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(applicationActions.updateApplicationError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  POST APPLICATION  ////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////
    on(applicationActions.postApplicationSuccess, (state, action) => {
        const applications = [...state.applications, action.application];
        const loading = false;
        return { ...state, applications, loading };
    }),
    on(applicationActions.postApplication, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(applicationActions.postApplicationError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),
);

export function reducer(state: State, action: Action) {
    return applicationReducer(state, action);
}
