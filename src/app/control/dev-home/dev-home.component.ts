import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, take, tap } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/modules/api/api.service';
import { IService } from '../../root/interfaces/service';
import { IInstance } from '../../root/interfaces/instance';
import { IApplication } from '../../root/interfaces/application';
import { selectApplications, selectCurrentApplication } from '../../root/store/selectors/application.selector';
import {
    appReducer,
    deleteApplication,
    deleteService,
    getApplication,
    getServices,
    postApplication,
    setCurrentApplication,
    updateApplication,
} from '../../root/store';
import { selectCurrentServices } from '../../root/store/selectors/service.selector';
import { ConfigDownloadService } from '../../shared/modules/helper/config-download.service';
import { IId } from '../../root/interfaces/id';
import { DialogAction } from '../../root/enums/dialogAction';
import { IDialogAttribute } from '../../root/interfaces/dialogAttribute';
import { DialogAddApplicationView } from '../navbar/dialogs/add-appllication/dialogAddApplication';
import { DialogServiceStatusView } from './dialogs/service-status/dialogServiceStatus';

@Component({
    selector: 'dev-home',
    templateUrl: './dev-home.component.html',
    styleUrls: ['./dev-home.component.scss'],
})
export class DevHomeComponent implements OnInit {
    DialogAction = DialogAction;
    @Input() userID: string;
    activeAppId: IId;
    public apps$: Observable<IApplication[]> = this.store.pipe(select(selectApplications));

    public currentApp$: Observable<IApplication> = this.store.pipe(select(selectCurrentApplication));
    public services$: Observable<IService[]> = this.store.pipe(select(selectCurrentServices));
    appId = '';
    isLoading = false;

    constructor(
        private router: Router,
        private api: ApiService,
        public dialog: MatDialog,
        private store: Store<appReducer.AppState>,
    ) {}

    ngOnInit(): void {
        this.store.dispatch(getApplication({ id: this.userID }));
        this.apps$.subscribe((apps) => {
            const active = apps.filter((a) => a._id.$oid === sessionStorage.getItem('id'))[0];
            if (active) {
                this.store.dispatch(setCurrentApplication({ application: active }));
                this.activeAppId = active._id;
            }
        });

        console.log('In Service Overview');
        this.currentApp$.pipe(tap((app) => (this.appId = app?._id?.$oid || ''))).subscribe();
    }

    deleteService(service: IService) {
        this.store.dispatch(deleteService({ service }));
    }

    // TODO Do this with the redux store.
    deleteInstance(service: IService, instance: IInstance) {
        this.api.deleteInstance(service, instance).subscribe();
        this.store.dispatch(getServices({ appId: this.appId }));
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
            services.forEach((service) => {
                this.deployService(service);
            });
        });
    }

    openDialogApp(action: DialogAction, app: IApplication | undefined) {
        if (action === DialogAction.ADD) {
            app = {
                _id: { $oid: '' },
                application_name: '',
                application_namespace: '',
                application_desc: '',
            };
        }

        const data: IDialogAttribute = {
            content: app,
            action,
        };

        const dialogRef = this.dialog.open(DialogAddApplicationView, { data });

        dialogRef.afterClosed().subscribe((result) => {
            if (result.event === DialogAction.ADD) {
                this.store.dispatch(postApplication({ application: result.data }));
            } else if (result.event === DialogAction.UPDATE) {
                this.store.dispatch(updateApplication({ application: result.data }));
            } else if (result.event === DialogAction.DELETE) {
                this.store.dispatch(deleteApplication({ application: result.data }));
                // this.deleteApplication(result.data);
            }
            // TODO remove this and get the id form the api response
            this.store.dispatch(getApplication({ id: this.userID }));
        });
    }
    /*
  deleteApplication(app: IApplication): void {
      // TODO Check what happens with the services in a application if you delete the application
      /*
      this.api.getServicesOfApplication(app._id.$oid).subscribe((services: IService[]) => {
          for (const j of services) {
              this.api.deleteService(j);
          }
      });

      this.api.deleteApplication(app).subscribe({
          next: () => {
              this.notifyService.notify(
                  NotificationType.success,
                  'Application "' + app.application_name + '" deleted successfully!',
              );
              // this.loadDataApplication();
          },
          error: () => {
              this.notifyService.notify(
                  NotificationType.error,
                  'Error: Deleting application "' + app.application_name + '" failed!',
              );
          },
      });
  }*/

    handleChange() {
        sessionStorage.setItem('id', this.activeAppId.$oid);
        this.apps$.subscribe((app) => {
            const application = app.filter((app) => app._id.$oid === this.activeAppId.$oid)[0];
            this.store.dispatch(setCurrentApplication({ application }));
            void this.router.navigate(['/control']).then();
        });
    }
}
