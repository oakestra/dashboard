import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as userActions from '../actions/user.actions';
import { ApiService } from '../../../shared/modules/api/api.service';
import { NotificationType } from '../../interfaces/notification';
import { NotificationService } from '../../../shared/modules/notification/notification.service';

@Injectable()
export class UserEffects {
    getUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActions.getUser),
            switchMap(({ name }) =>
                this.apiService.getUserByName(name).pipe(
                    map((currentUser) => userActions.getUserSuccess({ currentUser })),
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
                    map((newUser) => {
                        this.notifyService.notify(NotificationType.error, `User ${newUser.name} created successfully!`);
                        return userActions.postUserSuccess({ user: newUser });
                    }),
                    catchError((error) => {
                        this.notifyService.notify(NotificationType.error, 'User creation failed');
                        return of(userActions.postUserError({ error: error.message }));
                    }),
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

    getAllUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userActions.getAllUser),
            switchMap(({ organization_id }) =>
                this.apiService.getAllUser(organization_id).pipe(
                    map((users) => userActions.getAllUserSuccess({ users })),
                    catchError((error) => of(userActions.getAllUserError({ error: error.message }))),
                ),
            ),
        ),
    );

    constructor(
        private actions$: Actions,
        private apiService: ApiService,
        private notifyService: NotificationService,
    ) {}
}
