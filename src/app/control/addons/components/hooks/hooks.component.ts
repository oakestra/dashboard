import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Hook, HookEvent } from 'src/app/root/interfaces/addon';
import { NotificationType } from 'src/app/root/interfaces/notification';
import { appReducer, createHook, deleteHook, loadHooks } from 'src/app/root/store';
import { selectAddonsError, selectAddonsLoading, selectHooks } from 'src/app/root/store/selectors/addons.selector';
import { NotificationService } from 'src/app/shared/modules/notification/notification.service';
import { AddonsApiService } from '../../services/addons-api.service';

@Component({
  standalone: false,
    selector: 'app-hooks',
    templateUrl: './hooks.component.html',
    styleUrls: ['../../addons.scss'],
})
export class HooksComponent implements OnInit {
    hooks$: Observable<Hook[]> = this.store.pipe(select(selectHooks));
    loading$: Observable<boolean> = this.store.pipe(select(selectAddonsLoading));
    error$: Observable<string> = this.store.pipe(select(selectAddonsError));

    showForm = false;
    selectedHook: Hook | null = null;
    availableEvents = Object.values(HookEvent);
    selectedEvents: Record<string, boolean> = {};
    newHook: Hook = this.emptyHook();

    constructor(
        private store: Store<appReducer.AppState>,
        private addonsApi: AddonsApiService,
        private notifyService: NotificationService,
    ) {}

    ngOnInit(): void {
        this.addonsApi.clearEndpointOverrides();
        this.loadHooks();
    }

    loadHooks(): void {
        this.store.dispatch(loadHooks());
    }

    submitHook(): void {
        const events = Object.keys(this.selectedEvents).filter((event) => this.selectedEvents[event]) as HookEvent[];
        if (!this.newHook.hook_name.trim() || !this.newHook.entity.trim() || !this.newHook.webhook_url.trim()) {
            this.notifyService.notify(NotificationType.error, 'Hook name, entity, and webhook URL are required.');
            return;
        }
        if (events.length === 0) {
            this.notifyService.notify(NotificationType.error, 'Select at least one hook event.');
            return;
        }

        this.store.dispatch(createHook({ hook: { ...this.newHook, events } }));
        this.newHook = this.emptyHook();
        this.selectedEvents = {};
        this.showForm = false;
    }

    deleteHook(id: string | undefined): void {
        if (id && window.confirm('Delete this hook?')) {
            this.store.dispatch(deleteHook({ id }));
        }
    }

    viewDetails(hook: Hook): void {
        this.selectedHook = hook;
    }

    closeDetails(): void {
        this.selectedHook = null;
    }

    format(value: unknown): string {
        return JSON.stringify(value, null, 2);
    }

    private emptyHook(): Hook {
        return {
            hook_name: '',
            webhook_url: '',
            entity: '',
            events: [],
        };
    }
}
