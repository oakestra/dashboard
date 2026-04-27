import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomResource } from 'src/app/root/interfaces/addon';
import { NotificationType } from 'src/app/root/interfaces/notification';
import {
    appReducer,
    createCustomResource,
    createResourceInstance,
    deleteCustomResource,
    deleteResourceInstance,
    loadCustomResources,
    loadResourceInstances,
    selectCustomResourceType,
    updateResourceInstance,
} from 'src/app/root/store';
import {
    selectAddonsError,
    selectAddonsLoading,
    selectCustomResources,
    selectResourceInstances,
    selectSelectedResourceType,
} from 'src/app/root/store/selectors/addons.selector';
import { NotificationService } from 'src/app/shared/modules/notification/notification.service';
import { AddonsApiService } from '../../services/addons-api.service';

@Component({
    standalone: false,
    selector: 'app-custom-resources',
    templateUrl: './custom-resources.component.html',
    styleUrls: ['../../addons.scss'],
})
export class CustomResourcesComponent implements OnInit {
    resources$: Observable<CustomResource[]> = this.store.pipe(select(selectCustomResources));
    instances$: Observable<unknown[]> = this.store.pipe(select(selectResourceInstances));
    selectedResourceType$: Observable<string> = this.store.pipe(select(selectSelectedResourceType));
    loading$: Observable<boolean> = this.store.pipe(select(selectAddonsLoading));
    error$: Observable<string> = this.store.pipe(select(selectAddonsError));

    mode: 'definitions' | 'instances' = 'definitions';
    selectedDefinition: CustomResource | null = null;
    selectedInstance: unknown = null;
    showDefinitionForm = false;
    showInstanceForm: 'create' | 'edit' | null = null;
    editingInstanceId = '';
    selectedResourceType = '';
    filterField = '';
    filterValue = '';
    filters: Record<string, string> = {};

    definitionResourceType = '';
    definitionSchema = JSON.stringify(
        {
            type: 'object',
            properties: { name: { type: 'string' } },
            required: ['name'],
        },
        null,
        2,
    );
    instanceJson = JSON.stringify({ name: 'my-resource' }, null, 2);

    constructor(
        private store: Store<appReducer.AppState>,
        private addonsApi: AddonsApiService,
        private notifyService: NotificationService,
    ) {}

    ngOnInit(): void {
        this.addonsApi.clearEndpointOverrides();
        this.loadDefinitions();
        this.selectedResourceType$.subscribe((resourceType) => (this.selectedResourceType = resourceType));
    }

    loadDefinitions(): void {
        this.store.dispatch(loadCustomResources());
    }

    switchMode(mode: 'definitions' | 'instances'): void {
        this.mode = mode;
        if (mode === 'definitions') {
            this.loadDefinitions();
        } else if (this.selectedResourceType) {
            this.loadInstances();
        }
    }

    submitDefinition(): void {
        try {
            if (!this.definitionResourceType.trim()) {
                this.notifyService.notify(NotificationType.error, 'Resource type is required.');
                return;
            }
            const resource: CustomResource = {
                resource_type: this.definitionResourceType.trim(),
                schema: JSON.parse(this.definitionSchema),
            };
            this.store.dispatch(createCustomResource({ resource }));
            this.definitionResourceType = '';
            this.showDefinitionForm = false;
        } catch (error) {
            this.notifyService.notify(NotificationType.error, this.getErrorMessage(error, 'Invalid JSON schema.'));
        }
    }

    deleteDefinition(resourceType: string): void {
        if (window.confirm(`Delete ${resourceType} definition and all instances?`)) {
            this.store.dispatch(deleteCustomResource({ resourceType }));
        }
    }

    selectType(resourceType: unknown): void {
        const selectedType = String(resourceType || '');
        this.selectedResourceType = selectedType;
        this.store.dispatch(selectCustomResourceType({ resourceType: selectedType }));
        this.mode = 'instances';
        this.loadInstances();
    }

    loadInstances(): void {
        if (this.selectedResourceType) {
            this.store.dispatch(loadResourceInstances({ resourceType: this.selectedResourceType, filters: { ...this.filters } }));
        }
    }

    showCreateInstance(): void {
        this.showInstanceForm = 'create';
        this.editingInstanceId = '';
        this.instanceJson = JSON.stringify({ name: 'my-resource' }, null, 2);
    }

    showEditInstance(instance: unknown): void {
        const id = this.getInstanceId(instance);
        if (id) {
            this.showInstanceForm = 'edit';
            this.editingInstanceId = id;
            this.instanceJson = this.format(instance);
        }
    }

    submitInstance(): void {
        try {
            const data = JSON.parse(this.instanceJson) as Record<string, unknown>;
            if (this.showInstanceForm === 'edit' && this.editingInstanceId) {
                const { _id, ...updateData } = data;
                this.store.dispatch(
                    updateResourceInstance({
                        resourceType: this.selectedResourceType,
                        id: this.editingInstanceId,
                        data: updateData,
                    }),
                );
            } else {
                this.store.dispatch(createResourceInstance({ resourceType: this.selectedResourceType, data }));
            }
            this.showInstanceForm = null;
        } catch (error) {
            this.notifyService.notify(NotificationType.error, this.getErrorMessage(error, 'Invalid instance JSON.'));
        }
    }

    deleteInstance(instance: unknown): void {
        const id = this.getInstanceId(instance);
        if (id && window.confirm(`Delete ${this.selectedResourceType} instance?`)) {
            this.store.dispatch(deleteResourceInstance({ resourceType: this.selectedResourceType, id }));
        }
    }

    addFilter(): void {
        if (this.filterField && this.filterValue) {
            this.filters = {
                ...this.filters,
                [this.filterField]: this.filterValue,
            };
            this.filterField = '';
            this.filterValue = '';
            this.loadInstances();
        }
    }

    clearFilters(): void {
        this.filters = {};
        this.loadInstances();
    }

    getFilterKeys(): string[] {
        return Object.keys(this.filters);
    }

    getInstanceId(instance: unknown): string {
        const record = instance as Record<string, unknown>;
        return typeof record?._id === 'string' ? record._id : '';
    }

    getInstanceTitle(instance: unknown): string {
        const record = instance as Record<string, unknown>;
        return String(record?.name || record?._id || 'Resource instance');
    }

    getInstanceKeys(instance: unknown): string[] {
        return Object.keys((instance as Record<string, unknown>) || {}).filter((key) => key !== '_id').slice(0, 3);
    }

    formatValue(value: unknown): string {
        if (value === null || value === undefined) {
            return 'N/A';
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        const text = String(value);
        return text.length > 60 ? `${text.substring(0, 60)}...` : text;
    }

    read(instance: unknown, key: string): unknown {
        return (instance as Record<string, unknown>)[key];
    }

    format(value: unknown): string {
        return JSON.stringify(value, null, 2);
    }

    private getErrorMessage(error: unknown, fallback: string): string {
        return error instanceof Error ? error.message : fallback;
    }
}
