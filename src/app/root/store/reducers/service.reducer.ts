import { Action, createReducer, on } from '@ngrx/store';
import * as serviceActions from '../actions/service.actions';
import { IService } from '../../interfaces/service';

export const serviceFeatureKey = 'service';

export interface State {
    service: IService;
    loading: boolean;
    error: unknown;
}

export const initialState: State = {
    service: {},
    loading: false,
    error: {},
};

export const serviceReducer = createReducer(
    initialState,

    on(serviceActions.getServicesSuccess, (state, action) => {
        const service = action.service;
        const loading = false;
        return { ...state, service, loading };
    }),

    on(serviceActions.getServices, (state) => {
        const service = {} as IService;
        const loading = false;
        return { ...state, service, loading };
    }),

    on(serviceActions.getServicesError, (state, action) => {
        const services = {} as IService;
        const loading = false;
        const error = action.error;
        return { ...state, services, loading, error };
    }),
);

export function reducer(state: State, action: Action) {
    return serviceReducer(state, action);
}
