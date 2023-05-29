import { Action, createReducer, on } from '@ngrx/store';
import { IOrganization } from '../../interfaces/organization';
import * as organizationActions from '../actions/organization.action';

export interface State {
    organizations: IOrganization[];
    loading: boolean;
    error: unknown;
}

export const initialState: State = {
    organizations: [],
    loading: false,
    error: {},
};

export const organizationReducer = createReducer(
    initialState,

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  GET OrganizationS  //////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(organizationActions.getOrganization, (state) => {
        const organizations = [] as IOrganization[];
        const loading = true;
        return { ...state, organizations, loading };
    }),

    on(organizationActions.getOrganizationSuccess, (state, action) => {
        const organizations = action.organizations;
        console.log(action.organizations);
        const loading = false;
        return { ...state, organizations, loading };
    }),

    on(organizationActions.getOrganizationError, (state, action) => {
        const organizations = [] as IOrganization[];
        const loading = false;
        const error = action.error;
        return { ...state, organizations, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  DELETE Organization  ////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(organizationActions.deleteOrganization, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(organizationActions.deleteOrganizationSuccess, (state, action) => {
        const organizations = state.organizations.filter((o) => o._id.$oid !== action.organization._id.$oid);
        const loading = false;
        return { ...state, organizations, loading };
    }),

    on(organizationActions.deleteOrganizationError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  UPDATE Organization  ////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(organizationActions.updateOrganization, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(organizationActions.updateOrganizationSuccess, (state, action) => {
        const organizations = state.organizations.filter((o) => o._id.$oid !== action.organization._id.$oid);
        organizations.push(action.organization);
        const loading = false;
        return { ...state, organizations, loading };
    }),

    on(organizationActions.updateOrganizationError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  POST Organization  //////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(organizationActions.postOrganization, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(organizationActions.postOrganizationSuccess, (state, action) => {
        const organization = {
            _id: { $oid: action.id },
            ...action.organization,
        };
        const organizations = [...state.organizations, organization];
        const loading = false;
        return { ...state, organizations, loading };
    }),

    on(organizationActions.postOrganizationError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),

    on(organizationActions.resetOrganization, () => Object.assign({}, initialState)),
);

export function reducer(state: State, action: Action) {
    return organizationReducer(state, action);
}
