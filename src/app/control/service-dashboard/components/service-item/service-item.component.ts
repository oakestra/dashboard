import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NbDialogService, NbMenuBag, NbMenuService } from '@nebular/theme';
import { Subscription, tap } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IService } from '../../../../root/interfaces/service';
import { ApiService } from '../../../../shared/modules/api/api.service';
import { appReducer, deleteService, getServices } from '../../../../root/store';
import { IInstance } from '../../../../root/interfaces/instance';
import { Subject } from 'rxjs';
import { ConfigDownloadService } from '../../../../shared/modules/helper/config-download.service';
import { Observable } from 'tinymce';

@Component({
    selector: 'app-service-item',
    templateUrl: './service-item.component.html',
    styleUrls: ['./service-item.component.scss'],
})
export class ServiceItemComponent implements OnInit,OnDestroy {
    @Input() service: IService;
    @Input() appId: string;

    showSpinner = false;
    menuTag = '';
    menuItems: any[];
    private destroy$ = new Subject<void>();
    private menuItemClickSubscription: Subscription;

    constructor(
        private router: Router,
        private api: ApiService,
        public dialog: NbDialogService,
        private store: Store<appReducer.AppState>,
        private nbMenuService: NbMenuService,
    ) {}

    ngOnDestroy(): void {
        console.log('Destroy');
        this.menuItemClickSubscription.unsubscribe();
    }
    ngOnInit(): void {

        this.menuTag = 'menu-'+this.service._id?.$oid

        this.menuItems = [
            { title: 'Edit', icon: 'edit-2-outline', hidden: true },
            { title: 'Delete', icon: 'trash-2' },
            { title: 'Deploy', icon: 'paper-plane-outline' },
            { title: 'Download Config', icon: 'download-outline'},
        ];
        

        this.menuItemClickSubscription = this.nbMenuService
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
                            this.deployServiceWithin(this.service);
                            break;
                        case 'Download Config':
                            this.downloadConfig(this.service);
                            break;
                    }
                });
    }

    deleteService(service: IService) {
        this.showSpinner = true;
        setTimeout(() => {
            console.log('Delete');
            console.log(service);
            this.store.dispatch(deleteService({ service }));
        }, 5000);
    }

    deleteInstance(service: IService, instance: IInstance) {
        this.showSpinner = true;
        setTimeout(() => {
            this.api.deleteInstance(service, instance).subscribe();
            this.store.dispatch(getServices({ appId: this.appId }));
            this.showSpinner = false;
        }, 5000);
    }

    routeToInstanceDetail(instance: IInstance) {
        console.log('Go to instance Detail');
        console.log(instance);
        void this.router.navigate(['control/services', this.service._id?.$oid, instance.instance_number]);
    }

    deployServiceWithin(service: IService) {
        console.log('DeployServiceWithin');
        this.showSpinner = true;
        this.api
            .deployService(service)
            .pipe(
                tap(() => {
                    if (this.appId !== '') {
                        setTimeout(() => {
                            console.log('Ready');
                            this.showSpinner = false;
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
