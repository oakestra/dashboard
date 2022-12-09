import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as userActions from '../actions/user.actions';
import { ApiService } from '../../../shared/modules/api/api.service';

@Injectable()
export class UserEffects {
    loadUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActions.loadUser),
            switchMap(({ name }) =>
                this.apiService.getUserByName(name).pipe(
                    map((user) => userActions.userLoaded({ user })),
                    catchError((error) => of(userActions.loadUserError({ error: error.message }))),
                ),
            ),
        ),
    );

    constructor(private actions$: Actions, private apiService: ApiService) {}

    // TODO Add here the remaining effects
}
