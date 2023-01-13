import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

// TODO Refactor this Component and split it up to multiple small components
export class DeployFormComponent implements OnInit {
    @ViewChild('serviceInfo') serviceInfo: ServiceInfoComponent;
    @ViewChild('requirements') requirements: RequirementsComponent;
    @ViewChild('fileSelect') fileSelect: FileSelectComponent;
    @ViewChild('addresses') addresses: AddressesComponent;
    @ViewChild('arguments') arguments: ArgumentsComponent;
    @ViewChild('constraints') constraints: ConstraintsComponent;
    @ViewChild('connectivity') connectivity: ConnectivityComponent;

    form: FormGroup;
    file: File | undefined;
    filename = 'Select File to Upload';
    fileArrayForm = new FormArray([]);

    service: any = null;
    editingService = false; // True if the user is editing the service
    currentServiceID = ''; // This one is uses to get the service from the DB
    applicationId = '';
    currentApplication: IApplication;
    allServices: any; // For the Dropdown list of the connections
    jsonContent: any; // The final SLA witch is generated form the form

    app$: Observable<IApplication> = this.store.pipe(select(selectCurrentApplication));

    testService: IService = {
        microservice_name: 'daniel',
    };

    constructor(
        public dialog: MatDialog,
        private fb: FormBuilder,
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
        this.route.paramMap.subscribe((pram) => {
            if (pram.get('id') !== null) {
                this.editingService = true;
                this.currentServiceID = pram.get('id') ?? ''; // Set the id to the id in the URL

                this.api.getServiceByID(this.currentServiceID).subscribe((service: IService) => {
                    this.service = service;
                    this.createEditFormGroup();
                });
            } else {
                // user configures a new service
                this.service = true;
            }
        });
    }

    createEditFormGroup(): void {
        if (!this.service.constraints.empty) {
            const constraintsNumber = this.service.constraints.length;
            for (let i = 0; i < constraintsNumber; i++) {
                // this.addConstrains(this.service.constraints[i].type);
            }
        }

        if (!this.service.connectivity.empty) {
            const connectivityNumber = this.service.connectivity.length;
            for (let i = 0; i < connectivityNumber; i++) {
                this.addConnectivity();
            }
        }

        if (!this.service.added_files.empty) {
            const fileNumber = this.service.added_files.length;
            for (let i = 0; i < fileNumber; i++) {
                this.addFileInput();
            }
        }
    }

    // Add connectivity's between Services
    addConnectivity() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // TODO find better solution
        this.conConstrainsArray.push(new FormArray([]));
        // const n = this.connectivity.length;

        // this.connectivity.push(
        //     new FormGroup({
        //         target_microservice_id: new FormControl(),
        //         con_constraints: this.conConstrainsArray[n],
        //     }),
        // );
    }

    addFileInput() {
        // TODO Fix this
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.fileArrayForm.push(new FormControl());
    }

    addService() {
        // HOTFIXES to successfully push a service
        // Do this later better and implement the corresponding fields
        this.jsonContent.applications[0].microservices[0].cmd = [];
        this.jsonContent.applications[0].microservices[0].sla_violation_strategy = '';
        this.jsonContent.applications[0].microservices[0].target_node = '';
        this.jsonContent.applications[0].microservices[0].args = [];
        this.jsonContent.applications[0].microservices[0].enviroment = [];

        console.log(this.jsonContent);
        this.api.addService(this.jsonContent).subscribe({
            next: () => {
                // TODO is this this correct way? or how can i do that without the subscribe
                this.store.dispatch(postServiceSuccess({ service: this.jsonContent }));
                void this.router.navigate(['/control']).then();
                this.notifyService.notify(NotificationType.success, 'Service generation was successful');
            },
            error: () => this.notifyService.notify(NotificationType.error, 'File was not in the correct format'),
        });
    }

    onSubmit() {
        console.log('submit');

        // 1. TODO Get the data from the subcomponents and create the sla.
        // 2. TODO Create service from this data
        const service = this.serviceGenerator.generateService(
            this.serviceInfo.getData(),
            this.requirements.getData(),
            this.fileSelect.getData(),
            this.addresses.getData(),
            this.arguments.getData(),
            this.constraints.getData(),
            this.connectivity.getData(),
        );

        console.log('Generated Service');
        console.log(service);
        // 3. TODO Generate SLA from the service

        if (this.editingService) {
            this.slaGenerator.generateSLA(service);

            this.jsonContent.applications[0].microservices[0].microserviceID = this.currentServiceID;

            this.api.updateService(this.jsonContent, this.currentServiceID).subscribe({
                next: () => {
                    // TODO This is not the correct way, update the store properly
                    this.store.dispatch(updateServiceSuccess(this.jsonContent));
                    void this.router.navigate(['/control']).then();
                },
                error: (err) => {
                    console.log(err);
                },
            });
        } else {
            this.slaGenerator.generateSLA(service);
            this.addService();
        }
    }
}
