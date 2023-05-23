import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../../shared/modules/api/api.service';
import * as settingActions from '../actions/settings.action';

@Injectable()
export class SettingsEffects {
    getSettings$ = createEffect(() =>
        this.actions$.pipe(
            ofType(settingActions.getSettings),
            switchMap(() =>
                this.apiService.getSettings().pipe(
                    map((settings) => settingActions.getSettingsSuccess({ settings })),
                    catchError((error) => of(settingActions.getSettingsError({ error: error.message }))),
                ),
            ),
        ),
    );

    setSettings$ = createEffect(() =>
        this.actions$.pipe(
            ofType(settingActions.setSettings),
            switchMap(({ settings }) =>
                this.apiService.setSettings(settings).pipe(
                    map(() => settingActions.setSettingsSuccess({ settings })),
                    catchError((error) => of(settingActions.setSettingsError({ error: error.message }))),
                ),
            ),
        ),
    );

    constructor(private actions$: Actions, private apiService: ApiService) {}
}
