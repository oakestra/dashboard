import { createAction, props } from '@ngrx/store';
import { ISettings } from '../../interfaces/settings';

// //////////// GET SETTINGS /////////////
export const getSettings = createAction('[Settings] getSettings');
export const getSettingsSuccess = createAction('[Settings] getSettingsSuccess', props<{ settings: ISettings }>());
export const getSettingsError = createAction('[Settings] getSettingsError', props<{ error: string }>());

// //////////// SET SETTINGS /////////////
export const setSettings = createAction('[Settings] setSettings', props<{ settings: ISettings }>());
export const setSettingsSuccess = createAction('[Settings] setSettingsSuccess', props<{ settings: ISettings }>());
export const setSettingsError = createAction('[Settings] setSettingsError', props<{ error: string }>());
