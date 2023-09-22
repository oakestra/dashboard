import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../../shared/modules/api/api.service';
import * as organizationActions from '../actions/organization.action';
import { NotificationType } from '../../interfaces/notification';
import { NotificationService } from '../../../shared/modules/notification/notification.service';

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
                    map(() => {
                        this.notifyService.notify(
                            NotificationType.success,
                            `Organization ${organization.name} deleted successfully!`,
                        );
                        return organizationActions.deleteOrganizationSuccess({ organization });
                    }),
                    catchError((error) => {
                        this.notifyService.notify(NotificationType.error, 'Organization deletion failed');
                        return of(organizationActions.deleteOrganizationError({ error: error.message }));
                    }),
                ),
            ),
        ),
    );

    postOrganization$ = createEffect(() =>
        this.actions$.pipe(
            ofType(organizationActions.postOrganization),
            switchMap(({ organization }) =>
                this.apiService.addOrganization(organization).pipe(
                    map((id: string) => {
                        this.notifyService.notify(
                            NotificationType.success,
                            `Organization ${organization.name} created successfully!`,
                        );
                        return organizationActions.postOrganizationSuccess({ organization, id });
                    }),
                    catchError((error) => {
                        this.notifyService.notify(NotificationType.error, 'Organization creation failed');
                        return of(organizationActions.postOrganizationError({ error: error.message }));
                    }),
                ),
            ),
        ),
    );

    updateOrganization$ = createEffect(() =>
        this.actions$.pipe(
            ofType(organizationActions.updateOrganization),
            switchMap(({ organization }) =>
                this.apiService.updateOrganization(organization).pipe(
                    map(() => {
                        this.notifyService.notify(
                            NotificationType.success,
                            `Organization ${organization.name} modified successfully!`,
                        );
                        return organizationActions.updateOrganizationSuccess({ organization });
                    }),
                    catchError((error) => {
                        this.notifyService.notify(NotificationType.error, 'Organization modification failed');
                        return of(organizationActions.updateOrganizationError({ error: error.message }));
                    }),
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
