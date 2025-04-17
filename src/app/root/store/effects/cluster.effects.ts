import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as clusterActions from '../actions/cluster.actions';
import { ApiService } from '../../../shared/modules/api/api.service';

@Injectable()
export class ClusterEffects {
    getActiveClusters$ = createEffect(() =>
        this.actions$.pipe(
            ofType(clusterActions.getActiveClusters),
            switchMap(() => (
                this.apiService.getActiveClusters().pipe(
                    map((clusterList) => clusterActions.getClustersSuccess({ clusterList })),
                    catchError((error) => of(clusterActions.getClustersError({ error: error.message }))),
                )
            )
            ),
        ),
    );

    getClusters$ = createEffect(() =>
        this.actions$.pipe(
            ofType(clusterActions.getClusters),
            switchMap(() =>
                this.apiService.getClusters().pipe(
                    map((clusterList) => clusterActions.getClustersSuccess({ clusterList })),
                    catchError((error) => of(clusterActions.getClustersError({ error: error.message }))),
                ),
            ),
        ),
    );

    constructor(
        private actions$: Actions,
        private apiService: ApiService,
    ) {}
}
