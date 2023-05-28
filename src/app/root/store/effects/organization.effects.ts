import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../../shared/modules/api/api.service';
import * as organizationActions from '../actions/organization.action';

@Injectable()
export class OrganizationEffects {
    getOrganization$ = createEffect(() =>
        this.actions$.pipe(
            ofType(organizationActions.getOrganization),
            switchMap(() =>
                this.apiService.getOrganization().pipe(
                    map((organizations) => organizationActions.getOrganizationSuccess({ organizations })),
                    catchError((error) => of(organizationActions.getOrganizationError({ error: error.message }))),
                ),
            ),
        ),
    );

    deleteOrganization$ = createEffect(() =>
        this.actions$.pipe(
            ofType(organizationActions.deleteOrganization),
            switchMap(({ organization }) =>
                this.apiService.deleteOrganization(organization).pipe(
                    map(() => organizationActions.deleteOrganizationSuccess({ organization })),
                    catchError((error) => of(organizationActions.deleteOrganizationError({ error: error.message }))),
                ),
            ),
        ),
    );

    postOrganization$ = createEffect(() =>
        this.actions$.pipe(
            ofType(organizationActions.postOrganization),
            switchMap(({ organization }) =>
                this.apiService.addOrganization(organization).pipe(
                    map((id: string) => organizationActions.postOrganizationSuccess({ organization, id })),
                    catchError((error) => of(organizationActions.postOrganizationError({ error: error.message }))),
                ),
            ),
        ),
    );

    updateOrganization$ = createEffect(() =>
        this.actions$.pipe(
            ofType(organizationActions.updateOrganization),
            switchMap(({ organization }) =>
                this.apiService.updateOrganization(organization).pipe(
                    map(() => organizationActions.updateOrganizationSuccess({ organization })),
                    catchError((error) => of(organizationActions.updateOrganizationError({ error: error.message }))),
                ),
            ),
        ),
    );

    constructor(private actions$: Actions, private apiService: ApiService) {}
}
