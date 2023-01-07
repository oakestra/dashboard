import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as serviceActions from '../actions/service.actions';
import { ApiService } from '../../../shared/modules/api/api.service';

@Injectable()
export class ServiceEffects {
    getServices$ = createEffect(() =>
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

    postServices$ = createEffect(() =>
        this.actions$.pipe(
            ofType(serviceActions.postService),
            switchMap(({ service }) =>
                this.apiService.addService(service).pipe(
                    map((service) => serviceActions.getServicesSuccess({ service })),
                    catchError((error) => of(serviceActions.getServicesError({ error: error.message }))),
                ),
            ),
        ),
    );

    deleteServices$ = createEffect(() =>
        this.actions$.pipe(
            ofType(serviceActions.deleteService),
            switchMap(({ service }) =>
                this.apiService.deployService(service).pipe(
                    map((service) => serviceActions.getServicesSuccess({ service })),
                    catchError((error) => of(serviceActions.getServicesError({ error: error.message }))),
                ),
            ),
        ),
    );

    updateServices$ = createEffect(() =>
        this.actions$.pipe(
            ofType(serviceActions.deleteService),
            switchMap(({ service }) =>
                this.apiService.deployService(service).pipe(
                    map((service) => serviceActions.getServicesSuccess({ service })),
                    catchError((error) => of(serviceActions.getServicesError({ error: error.message }))),
                ),
            ),
        ),
    );

    constructor(private actions$: Actions, private apiService: ApiService) {}
}
