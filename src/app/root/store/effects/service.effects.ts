import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
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

    constructor(private actions$: Actions, private apiService: ApiService) {}

    // TODO Add here the remaining effects
}
