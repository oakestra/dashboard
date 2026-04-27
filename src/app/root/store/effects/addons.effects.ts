import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotificationType } from '../../interfaces/notification';
import { AddonsApiService } from '../../../control/addons/services/addons-api.service';
import { NotificationService } from '../../../shared/modules/notification/notification.service';
import * as addonsActions from '../actions/addons.actions';

@Injectable()
export class AddonsEffects {
    checkAvailability$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.checkAddonsAvailability),
            switchMap(() =>
                this.addonsApi.checkAvailability().pipe(
                    map((availability) =>
                        addonsActions.checkAddonsAvailabilitySuccess({
                            addonsAvailable: availability.addons,
                            customResourcesAvailable: availability.customResources,
                        }),
                    ),
                    catchError(() => of(addonsActions.checkAddonsAvailabilityError())),
                ),
            ),
        ),
    );

    loadMarketplaceAddons$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.loadMarketplaceAddons),
            switchMap(() =>
                this.addonsApi.getMarketplaceAddons().pipe(
                    map((addons) => addonsActions.loadMarketplaceAddonsSuccess({ addons })),
                    catchError((error) => of(addonsActions.loadMarketplaceAddonsError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    createMarketplaceAddon$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.createMarketplaceAddon),
            mergeMap(({ addon }) =>
                this.addonsApi.createMarketplaceAddon(addon).pipe(
                    tap(() => this.notificationService.notify(NotificationType.success, 'Addon submitted to marketplace')),
                    map(() => addonsActions.loadMarketplaceAddons()),
                    catchError((error) => of(addonsActions.loadMarketplaceAddonsError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    deleteMarketplaceAddon$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.deleteMarketplaceAddon),
            mergeMap(({ id }) =>
                this.addonsApi.deleteMarketplaceAddon(id).pipe(
                    tap(() => this.notificationService.notify(NotificationType.success, 'Addon deleted')),
                    map(() => addonsActions.loadMarketplaceAddons()),
                    catchError((error) => of(addonsActions.loadMarketplaceAddonsError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    loadInstalledAddons$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.loadInstalledAddons),
            switchMap(({ status }) =>
                this.addonsApi.getInstalledAddons(status && status !== 'all' ? { status } : undefined).pipe(
                    map((addons) => addonsActions.loadInstalledAddonsSuccess({ addons })),
                    catchError((error) => of(addonsActions.loadInstalledAddonsError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    installAddon$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.installAddon),
            mergeMap(({ marketplaceId }) =>
                this.addonsApi.installAddon(marketplaceId).pipe(
                    tap(() => this.notificationService.notify(NotificationType.success, 'Addon installation started')),
                    map(() => addonsActions.loadInstalledAddons({})),
                    catchError((error) => of(addonsActions.loadInstalledAddonsError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    disableAddon$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.disableAddon),
            mergeMap(({ id }) =>
                this.addonsApi.disableAddon(id).pipe(
                    tap(() => this.notificationService.notify(NotificationType.success, 'Addon disable requested')),
                    map(() => addonsActions.loadInstalledAddons({})),
                    catchError((error) => of(addonsActions.loadInstalledAddonsError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    loadHooks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.loadHooks),
            switchMap(() =>
                this.addonsApi.getHooks().pipe(
                    map((hooks) => addonsActions.loadHooksSuccess({ hooks })),
                    catchError((error) => of(addonsActions.loadHooksError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    createHook$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.createHook),
            mergeMap(({ hook }) =>
                this.addonsApi.createHook(hook).pipe(
                    tap(() => this.notificationService.notify(NotificationType.success, 'Hook created')),
                    map(() => addonsActions.loadHooks()),
                    catchError((error) => of(addonsActions.loadHooksError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    deleteHook$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.deleteHook),
            mergeMap(({ id }) =>
                this.addonsApi.deleteHook(id).pipe(
                    tap(() => this.notificationService.notify(NotificationType.success, 'Hook deleted')),
                    map(() => addonsActions.loadHooks()),
                    catchError((error) => of(addonsActions.loadHooksError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    loadCustomResources$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.loadCustomResources),
            switchMap(() =>
                this.addonsApi.getCustomResources().pipe(
                    map((resources) => addonsActions.loadCustomResourcesSuccess({ resources })),
                    catchError((error) => of(addonsActions.loadCustomResourcesError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    createCustomResource$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.createCustomResource),
            mergeMap(({ resource }) =>
                this.addonsApi.createCustomResource(resource).pipe(
                    tap(() => this.notificationService.notify(NotificationType.success, 'Custom resource created')),
                    map(() => addonsActions.loadCustomResources()),
                    catchError((error) => of(addonsActions.loadCustomResourcesError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    deleteCustomResource$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.deleteCustomResource),
            mergeMap(({ resourceType }) =>
                this.addonsApi.deleteCustomResource(resourceType).pipe(
                    tap(() => this.notificationService.notify(NotificationType.success, 'Custom resource deleted')),
                    map(() => addonsActions.loadCustomResources()),
                    catchError((error) => of(addonsActions.loadCustomResourcesError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    loadResourceInstances$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.loadResourceInstances),
            switchMap(({ resourceType, filters }) =>
                this.addonsApi.getResourcesByType(resourceType, filters).pipe(
                    map((instances) => addonsActions.loadResourceInstancesSuccess({ resourceType, instances })),
                    catchError((error) => of(addonsActions.loadResourceInstancesError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    createResourceInstance$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.createResourceInstance),
            mergeMap(({ resourceType, data }) =>
                this.addonsApi.createResourceInstance(resourceType, data).pipe(
                    tap(() => this.notificationService.notify(NotificationType.success, 'Resource instance created')),
                    map(() => addonsActions.loadResourceInstances({ resourceType })),
                    catchError((error) => of(addonsActions.loadResourceInstancesError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    updateResourceInstance$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.updateResourceInstance),
            mergeMap(({ resourceType, id, data }) =>
                this.addonsApi.updateResourceInstance(resourceType, id, data).pipe(
                    tap(() => this.notificationService.notify(NotificationType.success, 'Resource instance updated')),
                    map(() => addonsActions.loadResourceInstances({ resourceType })),
                    catchError((error) => of(addonsActions.loadResourceInstancesError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    deleteResourceInstance$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addonsActions.deleteResourceInstance),
            mergeMap(({ resourceType, id }) =>
                this.addonsApi.deleteResourceInstance(resourceType, id).pipe(
                    tap(() => this.notificationService.notify(NotificationType.success, 'Resource instance deleted')),
                    map(() => addonsActions.loadResourceInstances({ resourceType })),
                    catchError((error) => of(addonsActions.loadResourceInstancesError({ error: this.reportError(error) }))),
                ),
            ),
        ),
    );

    constructor(
        private actions$: Actions,
        private addonsApi: AddonsApiService,
        private notificationService: NotificationService,
    ) {}

    private getErrorMessage(error: unknown): string {
        const httpError = error as { error?: { message?: string }; message?: string; statusText?: string };
        return httpError.error?.message || httpError.message || httpError.statusText || 'Request failed';
    }

    private reportError(error: unknown): string {
        const message = this.getErrorMessage(error);
        this.notificationService.notify(NotificationType.error, message);
        return message;
    }
}
