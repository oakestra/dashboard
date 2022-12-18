import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as userActions from '../actions/user.actions';
import { ApiService } from '../../../shared/modules/api/api.service';

@Injectable()
export class UserEffects {
    getUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActions.getUser),
            switchMap(({ name }) =>
                this.apiService.getUserByName(name).pipe(
                    map((user) => userActions.getUserSuccess({ user })),
                    catchError((error) => of(userActions.getUserError({ error: error.message }))),
                ),
            ),
        ),
    );

    postUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActions.postUser),
            switchMap(({ user }) =>
                this.apiService.registerUser(user).pipe(
                    map(() => userActions.postUserSuccess({ user })),
                    catchError((error) => of(userActions.postUserError({ error: error.message }))),
                ),
            ),
        ),
    );

    updateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActions.updateUser),
            switchMap(({ user }) =>
                this.apiService.updateUser(user).pipe(
                    map(() => userActions.updateUserSuccess({ user })),
                    catchError((error) => of(userActions.updateUserError({ error: error.message }))),
                ),
            ),
        ),
    );

    deleteUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActions.deleteUser),
            switchMap(({ user }) =>
                this.apiService.deleteUser(user).pipe(
                    map(() => userActions.deleteUserSuccess({ user })),
                    catchError((error) => of(userActions.deleteUserError({ error: error.message }))),
                ),
            ),
        ),
    );

    constructor(private actions$: Actions, private apiService: ApiService) {}

    // TODO Add here the remaining effects
}
