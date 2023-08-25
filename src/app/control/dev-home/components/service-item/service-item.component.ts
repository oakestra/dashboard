import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { NbMenuService } from '@nebular/theme';
import { tap } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IService } from '../../../../root/interfaces/service';
import { ApiService } from '../../../../shared/modules/api/api.service';
import { appReducer, deleteService, getServices } from '../../../../root/store';
import { IInstance } from '../../../../root/interfaces/instance';
import { ConfigDownloadService } from '../../../../shared/modules/helper/config-download.service';

@Component({
    selector: 'app-service-item',
    templateUrl: './service-item.component.html',
    styleUrls: ['./service-item.component.scss'],
})
export class ServiceItemComponent implements OnInit {
    @Input() service: IService;
    @Input() appId: string;
    isLoading = false;
    menuTag: string;

    menuItems = [
        { title: 'Edit', icon: 'edit-2-outline' },
        { title: 'Delete', icon: 'trash-2' },
        { title: 'Deploy', icon: 'paper-plane-outline' },
        { title: 'Download Config', icon: 'download-outline' },
    ];

    constructor(
        private router: Router,
        private api: ApiService,
        public dialog: MatDialog,
        private store: Store<appReducer.AppState>,
        private nbMenuService: NbMenuService,
    ) {}

    ngOnInit(): void {
        this.menuTag = `action-menu${this.service._id.$oid}`;

        this.nbMenuService
            .onItemClick()
            .pipe(
                filter(({ tag }) => tag === this.menuTag),
                map(({ item: { title } }) => title),
            )
            .subscribe((title) => {
                switch (title) {
                    case 'Edit':
                        void this.router.navigate(['control/deploy', this.service._id?.$oid]);
                        break;
                    case 'Delete':
                        this.deleteService(this.service);
                        break;
                    case 'Deploy':
                        this.deployService(this.service);
                        break;
                    case 'Download Config':
                        this.downloadConfig(this.service);
                        break;
                }
            });
    }

    deleteService(service: IService) {
        console.log('Delete');
        console.log(service);
        this.store.dispatch(deleteService({ service }));
    }

    deleteInstance(service: IService, instance: IInstance) {
        this.api.deleteInstance(service, instance).subscribe();
        this.store.dispatch(getServices({ appId: this.appId }));
    }

    routeToInstanceDetail(instance: IInstance) {
        console.log('Go to instance Detail');
        console.log(instance);
        void this.router.navigate(['control/services', this.service._id?.$oid, instance.instance_number]);
    }

    deployService(service: IService) {
        this.isLoading = true;
        this.api
            .deployService(service)
            .pipe(
                tap(() => {
                    if (this.appId !== '') {
                        setTimeout(() => {
                            this.isLoading = false;
                            this.store.dispatch(getServices({ appId: this.appId }));
                        }, 5000); // delay to wait until the backend has deployed the service
                    }
                }),
            )
            .subscribe();
    }

    downloadConfig(service: IService) {
        ConfigDownloadService.download(service);
    }
}
