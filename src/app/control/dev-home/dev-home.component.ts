import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ApiService } from '../../shared/modules/api/api.service';
import { DialogServiceStatusView } from '../dialogs/service-status/dialogServiceStatus';
import { IService } from '../../root/interfaces/service';
import { IInstance } from '../../root/interfaces/instance';
import { IApplication } from '../../root/interfaces/application';
import { selectCurrentApplication } from '../../root/store/selectors/application.selector';
import { appReducer, deleteService } from '../../root/store';
import { selectCurrentServices } from '../../root/store/selectors/service.selector';

@Component({
    selector: 'dev-home',
    templateUrl: './dev-home.component.html',
    styleUrls: ['./dev-home.component.css'],
})
export class DevHomeComponent implements OnInit {
    public currentApp$: Observable<IApplication> = this.store.pipe(select(selectCurrentApplication));
    public services$: Observable<IService[]> = this.store.pipe(select(selectCurrentServices));

    constructor(private api: ApiService, public dialog: MatDialog, private store: Store<appReducer.AppState>) {}

    ngOnInit(): void {
        console.log('In Dev');
    }

    deleteService(service: IService) {
        this.store.dispatch(deleteService({ service }));
    }

    deleteInstance(service: IService, instance: IInstance) {
        this.api.deleteInstance(service, instance).subscribe();
    }

    deployService(service: IService) {
        this.api.deployService(service).subscribe();
    }

    deleteServiceWithGraph(id: string) {
        const service: IService = { _id: { $oid: id } };
        this.deleteService(service);
    }

    openStatusDialog(service: IService) {
        const dialogRef = this.dialog.open(DialogServiceStatusView, { data: service });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }

    deployAllServices() {
        // TODO implement functionality
        console.log('Not implemented');
    }

    private setting = {
        element: {
            dynamicDownload: null as any,
        },
    };

    // TODO Put this in a service
    downloadConfig(service: IService) {
        if (service._id) {
            delete service._id;
        }
        const fileName = service.microservice_name + '.json';
        if (!this.setting.element.dynamicDownload) {
            this.setting.element.dynamicDownload = document.createElement('a');
        }
        const element = this.setting.element.dynamicDownload;
        const fileType = fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
        element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(JSON.stringify(service))}`);
        element.setAttribute('download', fileName);
        const event = new MouseEvent('click');
        element.dispatchEvent(event);
    }
}
