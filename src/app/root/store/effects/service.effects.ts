import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
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

    getSingleService$ = createEffect(() =>
        this.actions$.pipe(
            ofType(serviceActions.getSingleService),
            switchMap(({ serviceId }) =>
                this.apiService.getServiceByID(serviceId).pipe(
                    map((service) => serviceActions.getSingleServiceSuccess({ service })),
                    catchError((error) => of(serviceActions.getSingleServiceError({ error: error.message }))),
                ),
            ),
        ),
    );

    postServices$ = createEffect(() =>
        this.actions$.pipe(
            ofType(serviceActions.postService),
            mergeMap(({ service }) =>
                this.apiService.addService(service).pipe(
                    map((serviceId) => {
                        this.notifyService.notify(NotificationType.success, 'Service created successfully!');
                        return serviceActions.postServiceSuccess({ service, serviceId });
                    }),
                    tap(() => this.router.navigate(['/control/services'])),
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
                    map(() => {
                        this.notifyService.notify(
                            NotificationType.success,
                            `Service ${service.microservice_name} deleted successfully!`,
                        );
                        return serviceActions.deleteServiceSuccess({ service });
                    }),
                    catchError((error) => {
                        this.notifyService.notify(NotificationType.error, 'Service deletion failed');
                        return of(serviceActions.deleteServiceError({ error: error.message }));
                    }),
                ),
            ),
        ),
    );

    updateServices$ = createEffect(() =>
        this.actions$.pipe(
            ofType(serviceActions.updateService),
            switchMap(({ service }) =>
                this.apiService.updateService(service, service._id.$oid).pipe(
                    map((service) => {
                        this.notifyService.notify(
                            NotificationType.success,
                            `Service ${service.microservice_name} modified successfully!`,
                        );
                        return serviceActions.updateServiceSuccess({ service });
                    }),
                    catchError((error) => {
                        this.notifyService.notify(NotificationType.error, 'Service modification failed');
                        return of(serviceActions.updateServiceError({ error: error.message }));
                    }),
                ),
            ),
        ),
    );

    constructor(
        private actions$: Actions,
        private apiService: ApiService,
        private notifyService: NotificationService,
        private router: Router,
    ) {}
}
