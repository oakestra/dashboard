import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as serviceActions from '../actions/service.actions';
import { ApiService } from '../../../shared/modules/api/api.service';
import { NotificationType } from '../../interfaces/notification';
import { NotificationService } from '../../../shared/modules/notification/notification.service';

@Injectable()
export class ServiceEffects {
    getServicesOfApp$ = createEffect(() =>
        this.actions$.pipe(
            ofType(serviceActions.getServices),
            switchMap(({ appId }) =>
                this.apiService.getServicesOfApplication(appId).pipe(
                    map((services) => serviceActions.getServicesSuccess({ services })),
                    catchError((error) => of(serviceActions.getServicesError({ error: error.message }))),
                ),
            ),
        ),
    );
    /*
    getServiceByID$ = createEffect(() =>
        this.actions$.pipe(
            ofType(serviceActions.getServices),
            mergeMap(() =>
                this.apiService.getServiceByID('qwaedrf').pipe(
                    map((service) => serviceActions.getServicesSuccess({ service })),
                    catchError((error) => of(serviceActions.getServicesError({ error: error.message }))),
                ),
            ),
        ),
    );

 */

    postServices$ = createEffect(() =>
        this.actions$.pipe(
            ofType(serviceActions.postService),
            switchMap(({ service }) =>
                this.apiService.addService(service).pipe(
                    map((service) => serviceActions.postServiceSuccess({ service })),
                    catchError((error) => {
                        this.notifyService.notify(NotificationType.error, 'File was not in the correct format');
                        return of(serviceActions.postServiceError({ error: error.message }));
                    }),
                ),
            ),
        ),
    );

    deleteServices$ = createEffect(() =>
        this.actions$.pipe(
            ofType(serviceActions.deleteService),
            switchMap(({ service }) =>
                this.apiService.deleteService(service).pipe(
                    map((service) => serviceActions.deleteServiceSuccess({ service })),
                    catchError((error) => of(serviceActions.deleteServiceError({ error: error.message }))),
                ),
            ),
        ),
    );

    updateServices$ = createEffect(() =>
        this.actions$.pipe(
            ofType(serviceActions.deleteService),
            switchMap(({ service }) =>
                this.apiService.updateService(service, service._id.$oid).pipe(
                    map((service) => serviceActions.updateServiceSuccess({ service })),
                    catchError((error) => of(serviceActions.updateServiceError({ error: error.message }))),
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
