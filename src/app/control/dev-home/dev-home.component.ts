import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { SharedIDService } from '../../shared/modules/helper/shared-id.service';
import { ApiService } from '../../shared/modules/api/api.service';
import { DialogServiceStatusView } from '../dialogs/service-status/dialogServiceStatus';
import { DialogConfirmationView } from '../dialogs/confirmation/dialogConfirmation';
import { NotificationService } from '../../shared/modules/notification/notification.service';
import { IService } from '../../root/interfaces/service';
import { ICluster } from '../../root/interfaces/cluster';
import { IInstance } from '../../root/interfaces/instance';
import { NotificationType } from '../../root/interfaces/notification';

@Component({
    selector: 'dev-home',
    templateUrl: './dev-home.component.html',
    styleUrls: ['./dev-home.component.css'],
})

// TODO Delete Cluster stuff from here
export class DevHomeComponent implements OnInit, OnDestroy {
    services: IService[];
    servicesCount = 0;
    appName = '';
    appID = '';
    clusterName = '';
    clusterID = '';
    cluster_info: any;

    is_app = true;

    subscriptions: Subscription[] = [];

    constructor(
        public sharedService: SharedIDService,
        private api: ApiService,
        public dialog: MatDialog,
        private router: Router,
        private notifyService: NotificationService,
    ) {}

    ngOnInit(): void {
        /*
        const sub2 = this.sharedService.clusterObserver$.subscribe((x) => {
            this.cluster_info = x;
            this.clusterName = x.cluster_name || 'clu';
            this.clusterID = x._id.$oid;
            this.is_app = false;
            // this.initMap()
        });
        this.subscriptions.push(sub2);


        const sub = this.sharedService.applicationObserver$.subscribe((x) => {
            this.appName = x.application_name;
            this.appID = x._id.$oid;
            this.is_app = true;
            this.loadData();
        });
        this.subscriptions.push(sub);
        */
    }

    ngOnDestroy() {
        for (const s of this.subscriptions) {
            s.unsubscribe();
        }
    }

    loadData(): void {
        const sub = this.api.getServicesOfApplication(this.appID).subscribe({
            next: (services: IService[]) => {
                this.services = services;
                this.servicesCount = services.length;
            },
            error: (err) => {
                console.log(err);
            },
        });
        this.subscriptions.push(sub);
    }

    deleteService(service: IService) {
        this.api.deleteService(service).subscribe(() => {
            this.loadData();
        });
    }

    deleteInstance(service: IService, instance: IInstance) {
        this.api.deleteInstance(service, instance).subscribe(() => {
            this.loadData();
        });
    }

    deployService(service: IService) {
        this.api.deployService(service).subscribe(() => {
            this.loadData();
        });
    }

    deleteServiceWithGraph(id: string) {
        const service: IService = { _id: { $oid: id } };
        this.api.deleteService(service).subscribe(() => {
            this.loadData();
        });
    }

    // repeated function in navbar.component.ts // TODO Why repeated?
    deleteCluster(cluster: ICluster) {
        const data = {
            text: 'Delete cluster: ' + cluster.cluster_name,
            type: 'cluster',
        };
        const dialogRef = this.dialog.open(DialogConfirmationView, { data });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.event === true) {
                this.api.deleteCluster(cluster._id.$oid).subscribe({
                    next: () => {
                        this.notifyService.notify(
                            NotificationType.success,
                            'Cluster ' + cluster.cluster_name + ' deleted successfully!',
                        );
                        void this.router
                            .navigateByUrl('/', { skipLocationChange: true })
                            .then(() => this.router.navigate(['/control']));
                    },
                    error: () => {
                        this.notifyService.notify(
                            NotificationType.error,
                            'Error: Deleting cluster ' + cluster.cluster_name,
                        );
                    },
                });
            }
        });
    }

    openStatusDialog(service: IService) {
        const dialogRef = this.dialog.open(DialogServiceStatusView, { data: service });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }

    deployAllServices() {
        for (const j of this.services) {
            this.deployService(j);
        }
    }

    private setting = {
        element: {
            dynamicDownload: null as any,
        },
    };

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
