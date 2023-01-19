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
import { ConfigDownloadService } from '../../shared/modules/helper/config-download.service';

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
        console.log('In Service Overview');
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

    openStatusDialog(service: any) {
        const dialogRef = this.dialog.open(DialogServiceStatusView, { data: service });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }

    downloadConfig(service: IService) {
        ConfigDownloadService.download(service);
    }

    deployAllServices() {
        // TODO implement functionality
        console.log('Not implemented');
    }
}
