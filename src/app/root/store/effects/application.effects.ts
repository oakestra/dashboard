import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../../shared/modules/api/api.service';
import * as applicationActions from '../actions/application.action';

@Injectable()
export class UserEffects {
    loadApplication$ = createEffect(() =>
        this.actions$.pipe(
            ofType(applicationActions.getApplication),
            switchMap(({ id }) =>
                this.apiService.getAppById(id).pipe(
                    map((applications) => applicationActions.getApplicationSuccess({ applications })),
                    catchError((error) => of(applicationActions.getApplicationError({ error: error.message }))),
                ),
            ),
        ),
    );

    constructor(private actions$: Actions, private apiService: ApiService) {}

    // TODO Add here the remaining effects
}
