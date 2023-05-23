import { Action, createReducer, on } from '@ngrx/store';
import * as settingActions from '../actions/settings.action';
import { ConfigurationType, ISettings } from '../../interfaces/settings';

export const userFeatureKey = 'settings';

export interface State {
    settings: ISettings;
    loading: boolean;
    error: unknown;
}

export const initialState: State = {
    settings: { type: ConfigurationType.NONE },
    loading: false,
    error: {},
};

export const settingsReducer = createReducer(
    initialState,

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  GET SETTINGS  //////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(settingActions.getSettings, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(settingActions.getSettingsSuccess, (state, action) => {
        const settings = action.settings;
        const loading = false;
        return { ...state, settings, loading };
    }),

    on(settingActions.getSettingsError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),

    // ///////////////////////////////////////////////////////////////////////////
    // /////////////////////  SET SETTINGS   /////////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////

    on(settingActions.setSettings, (state) => {
        const loading = true;
        return { ...state, loading };
    }),

    on(settingActions.setSettingsSuccess, (state, action) => {
        const settings = action.settings;
        const loading = false;
        return { ...state, settings, loading };
    }),

    on(settingActions.setSettingsError, (state, action) => {
        const loading = false;
        const error = action.error;
        return { ...state, loading, error };
    }),
);

export function reducer(state: State, action: Action) {
    return settingsReducer(state, action);
}
