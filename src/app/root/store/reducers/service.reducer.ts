import { Action, createReducer, on } from '@ngrx/store';
import * as serviceActions from '../actions/service.actions';
import { IService } from '../../interfaces/service';

export const serviceFeatureKey = 'service';

export interface State {
    servicesOfApp: IService[];
    loading: boolean;
    error: unknown;
}

export const initialState: State = {
    servicesOfApp: [],
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
        const servicesOfApp = action.services;
        const loading = false;
        return { ...state, servicesOfApp, loading };
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
        // Get the service form the sla.
        const service = {
            $oid: action.serviceId,
            ...action.service.applications[0].microservices[0],
        };
        service.microserviceID = action.serviceId;
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
    // TODO check if everything works fine

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
        const service = state.servicesOfApp.filter((s: IService) => s !== action.service);
        const loading = false;
        return { ...state, service, loading };
    }),

    on(serviceActions.deleteServiceError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  GET SINGLE SERVICE  //////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(serviceActions.getSingleService, (state) => {
        const loading = false;
        return { ...state, loading };
    }),

    on(serviceActions.getSingleServiceSuccess, (state, action) => {
        const servicesOfApp: IService[] = state.servicesOfApp.filter(
            (s: IService) => s._id.$oid !== action.service._id.$oid,
        );
        servicesOfApp.push(action.service);
        const loading = false;
        return { ...state, servicesOfApp, loading };
    }),

    on(serviceActions.getSingleServiceError, (state, action) => {
        const service = {} as IService;
        const loading = false;
        const error = action.error;
        return { ...state, service, loading, error };
    }),
    // /////////////////////// RESET SERVICES ///////////////////////////////////////////
    on(serviceActions.resetService, () => Object.assign({}, initialState)),
);

export function reducer(state: State, action: Action) {
    return serviceReducer(state, action);
}
