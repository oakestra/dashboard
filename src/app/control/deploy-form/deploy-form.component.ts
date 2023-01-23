import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/modules/api/api.service';
import { NotificationService } from '../../shared/modules/notification/notification.service';
import { IApplication } from '../../root/interfaces/application';
import { IService } from '../../root/interfaces/service';
import { NotificationType } from '../../root/interfaces/notification';
import { appReducer, postServiceSuccess, updateServiceSuccess } from '../../root/store';
import { selectCurrentApplication } from '../../root/store/selectors/application.selector';
import { SlaGeneratorService } from '../../shared/modules/helper/sla-generator.service';
import { ServiceGeneratorService } from '../../shared/modules/helper/service-generator.service';
import { IUser } from '../../root/interfaces/user';
import { selectCurrentUser } from '../../root/store/selectors/user.selector';
import { ServiceInfoComponent } from './components/service-info/service-info.component';
import { RequirementsComponent } from './components/requirements/requirements.component';
import { FileSelectComponent } from './components/file-select/file-select.component';
import { AddressesComponent } from './components/addresses/addresses.component';
import { ArgumentsComponent } from './components/arguments/arguments.component';
import { ConstraintsComponent } from './components/constraints/constraints.component';
import { ConnectivityComponent } from './components/connectivity/connectivity.component';

@Component({
    selector: 'deploy-form',
    templateUrl: './deploy-form.component.html',
    styleUrls: ['./deploy-form.component.css'],
})
export class DeployFormComponent implements OnInit {
    @ViewChild('serviceInfo') serviceInfo: ServiceInfoComponent;
    @ViewChild('requirements') requirements: RequirementsComponent;
    @ViewChild('fileSelect') fileSelect: FileSelectComponent;
    @ViewChild('addresses') addresses: AddressesComponent;
    @ViewChild('arguments') arguments: ArgumentsComponent;
    @ViewChild('constraints') constraints: ConstraintsComponent;
    @ViewChild('connectivity') connectivity: ConnectivityComponent;

    service: any = null;

    editingService = false; // True if the user is editing the service

    currentServiceID = ''; // This one is uses to get the service from the DB
    applicationId = '';

    currentApplication: IApplication;
    allServices: any; // For the Dropdown list of the connections
    app$: Observable<IApplication> = this.store.pipe(select(selectCurrentApplication));

    currentUser$: Observable<IUser> = this.store.pipe(select(selectCurrentUser));
    currentUser: IUser;

    testService: IService = {
        microservice_name: '',
    };

    constructor(
        private route: ActivatedRoute,
        private api: ApiService,
        private router: Router,
        private notifyService: NotificationService,
        private store: Store<appReducer.AppState>,
        private slaGenerator: SlaGeneratorService,
        private serviceGenerator: ServiceGeneratorService,
    ) {
        this.currentServiceID = 'not yet defined';
        this.app$.subscribe((app) => {
            console.log(app);
            this.currentApplication = app;
            this.applicationId = app._id.$oid;
            this.api
                // TODO Do not subscribe here, use the data in the store instead
                .getServicesOfApplication(this.applicationId)
                .pipe(take(1))
                .subscribe({
                    next: (services: IService[]) => {
                        this.allServices = services.filter((s: IService) => s._id?.$oid !== this.currentServiceID);
                    },
                    error: (err) => {
                        console.log(err);
                    },
                });
        });
    }

    ngOnInit() {
        console.log('In service form');
        this.currentUser$.subscribe((user) => (this.currentUser = user));
    }

    onSubmit() {
        const service = this.serviceGenerator.generateService(
            this.serviceInfo.getData(),
            this.requirements.getData(),
            this.fileSelect.getData(),
            this.addresses.getData(),
            this.arguments.getData(),
            this.constraints.getData(),
            this.connectivity.getData(),
        );

        console.log(service);
        const sla = this.slaGenerator.generateSLA(service, this.currentApplication, this.currentUser);
        console.log(sla);
        if (this.editingService) {
            this.updateService(sla);
        } else {
            this.addService(sla);
        }
    }

    updateService(sla: any) {
        this.api.updateService(sla, this.currentServiceID).subscribe({
            next: () => {
                // TODO This is not the correct way, update the store properly
                this.store.dispatch(updateServiceSuccess(sla));
                void this.router.navigate(['/control']).then();
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    addService(sla: any) {
        // HOTFIXES to successfully push a service
        // TODO Do this later better and implement the corresponding fields
        sla.applications[0].microservices[0].cmd = [];
        sla.applications[0].microservices[0].sla_violation_strategy = '';
        sla.applications[0].microservices[0].target_node = '';
        sla.applications[0].microservices[0].args = [];
        sla.applications[0].microservices[0].enviroment = [];

        console.log(sla);
        this.api.addService(sla).subscribe({
            next: () => {
                // TODO is this this correct way? or how can i do that without the subscribe
                this.store.dispatch(postServiceSuccess({ service: sla }));
                void this.router.navigate(['/control']).then();
                this.notifyService.notify(NotificationType.success, 'Service generation was successful');
            },
            error: () => this.notifyService.notify(NotificationType.error, 'File was not in the correct format'),
        });
    }
}
