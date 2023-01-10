import { Action, createReducer, on } from '@ngrx/store';
import * as serviceActions from '../actions/service.actions';
import { IService } from '../../interfaces/service';

export const serviceFeatureKey = 'service';

export interface State {
    servicesOfApp: IService[];
    // service: IService;
    loading: boolean;
    error: unknown;
}

export const initialState: State = {
    servicesOfApp: [],
    // service: {},
    loading: false,
    error: {},
};

export const serviceReducer = createReducer(
    initialState,

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  GET SERVICE  //////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    // TODO FIX gets called multiple times
    on(serviceActions.getServicesSuccess, (state, action) => {
        console.log('action.services');
        console.log(action.services);
        const service = action.services;
        const loading = false;
        return { ...state, service, loading };
    }),

    on(serviceActions.getServices, (state) => {
        const service = {} as IService;
        const loading = false;
        return { ...state, service, loading };
    }),

    on(serviceActions.getServicesError, (state, action) => {
        const service = {} as IService;
        const loading = false;
        const error = action.error;
        return { ...state, service, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  POST SERVICE  //////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(serviceActions.postService, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(serviceActions.postServiceSuccess, (state, action) => {
        // const services = [...state.service, action.service];
        const service = action.service;
        const loading = false;
        return { ...state, service, loading };
    }),

    on(serviceActions.postServiceError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  UPDATE SERVICE  ////////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////
    // TODO

    on(serviceActions.updateService, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(serviceActions.updateServiceSuccess, (state, action) => {
        console.log(action);
        const service = state.servicesOfApp;
        const loading = false;
        return { ...state, service, loading };
    }),

    on(serviceActions.updateServiceError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  DELETE SERVICE  ////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(serviceActions.deleteService, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(serviceActions.deleteServiceSuccess, (state, action) => {
        // TODO
        const service = action.service;
        // const service = state.service.filter((s: IService) => s !== action.service);
        const loading = false;
        return { ...state, service, loading };
    }),

    on(serviceActions.deleteServiceError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),
);

export function reducer(state: State, action: Action) {
    return serviceReducer(state, action);
}
