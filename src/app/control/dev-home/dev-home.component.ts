import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, Observable, take, tap } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ApiService } from '../../shared/modules/api/api.service';
import { IService } from '../../root/interfaces/service';
import { IInstance } from '../../root/interfaces/instance';
import { IApplication } from '../../root/interfaces/application';
import { selectCurrentApplication } from '../../root/store/selectors/application.selector';
import { appReducer, deleteService, getServices } from '../../root/store';
import { selectCurrentServices } from '../../root/store/selectors/service.selector';
import { ConfigDownloadService } from '../../shared/modules/helper/config-download.service';
import { DialogServiceStatusView } from './dialogs/service-status/dialogServiceStatus';

@Component({
    selector: 'dev-home',
    templateUrl: './dev-home.component.html',
    styleUrls: ['./dev-home.component.scss'],
})
export class DevHomeComponent implements OnInit {
    public currentApp$: Observable<IApplication> = this.store.pipe(select(selectCurrentApplication));
    public services$: Observable<IService[]> = this.store.pipe(select(selectCurrentServices));
    appId = '';

    constructor(private api: ApiService, public dialog: MatDialog, private store: Store<appReducer.AppState>) {}

    ngOnInit(): void {
        console.log('In Service Overview');
        this.currentApp$.pipe(tap((app) => (this.appId = app?._id?.$oid || ''))).subscribe();
    }

    deleteService(service: IService) {
        this.store.dispatch(deleteService({ service }));
    }

    deleteInstance(service: IService, instance: IInstance) {
        this.api.deleteInstance(service, instance).subscribe();
    }

    deployService(service: IService) {
        this.api
            .deployService(service)
            .pipe(
                tap(() => {
                    if (this.appId !== '') {
                        this.store.dispatch(getServices({ appId: this.appId }));
                    }
                }),
            )
            .subscribe();
    }

    deleteServiceWithGraph(id: string) {
        const service: IService = { _id: { $oid: id } };
        this.deleteService(service);
    }

    openStatusDialog(service: IService, instanceNumber: number) {
        const dialogRef = this.dialog.open(DialogServiceStatusView, {
            data: { service, instanceNumber },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }

    downloadConfig(service: IService) {
        ConfigDownloadService.download(service);
    }

    deployAllServices() {
        this.services$.pipe(take(1)).subscribe((services) => {
            const deployObservables = services.map((s) => this.api.deployService(s));
            forkJoin(deployObservables).subscribe(() => {
                console.log('Alle Subscriptions sind abgeschlossen.');
                this.store.dispatch(getServices({ appId: this.appId })); // Aktion dispatchen
            });
        });
    }
}
