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
    on(serviceActions.getServices, (state) => {
        const servicesOfApp = [] as IService[];
        const loading = false;
        return { ...state, servicesOfApp, loading };
    }),

    on(serviceActions.getServicesSuccess, (state, action) => {
        const servicesOfApp = action.services;
        const loading = false;
        return { ...state, servicesOfApp, loading };
    }),

    on(serviceActions.getServicesError, (state, action) => {
        const servicesOfApp = [] as IService[];
        const loading = false;
        const error = action.error;
        return { ...state, servicesOfApp, loading, error };
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
        const id = action.serviceId.job_id;
        const service = {
            _id: { $oid: id },
            ...action.service.applications[0].microservices[0],
        };
        service.microserviceID = id;
        const servicesOfApp = [...state.servicesOfApp];
        servicesOfApp.push(service);

        console.log(servicesOfApp);
        const loading = false;
        return { ...state, servicesOfApp, loading };
    }),

    on(serviceActions.postServiceError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  UPDATE SERVICE  ////////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(serviceActions.updateService, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(serviceActions.updateServiceSuccess, (state, action) => {
        const servicesOfApp = state.servicesOfApp.filter((s: IService) => s._id.$oid !== action.service._id.$oid);
        servicesOfApp.push(action.service);
        const loading = false;
        return { ...state, servicesOfApp, loading };
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
        const servicesOfApp = state.servicesOfApp.filter((s: IService) => s._id.$oid !== action.service._id.$oid);
        const loading = false;
        return { ...state, servicesOfApp, loading };
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
