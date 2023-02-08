import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { selectCurrentServices } from '../../root/store/selectors/service.selector';
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

    editingService = false; // True if the user is editing the service

    app$: Observable<IApplication> = this.store.pipe(select(selectCurrentApplication));
    currentApplication: IApplication;

    currentUser$: Observable<IUser> = this.store.pipe(select(selectCurrentUser));
    currentUser: IUser;

    services$: Observable<IService[]> = this.store.pipe(select(selectCurrentServices));
    service: IService;
    currentServiceID = ''; // This one is uses to get the service from the DB

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
        });
    }

    ngOnInit() {
        this.currentUser$.subscribe((user) => (this.currentUser = user));

        this.services$.subscribe({
            next: (services: IService[]) => {
                const s = services.filter((s: IService) => s._id?.$oid !== this.currentServiceID);
                this.service = s.length === 0 ? null : s[0];
            },
            error: (err) => {
                console.log(err);
            },
        });
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

        const sla = this.slaGenerator.generateSLA(service, this.currentApplication, this.currentUser);
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
        // TODO Call here dispatch
        this.api.updateApplicationWithService(sla).subscribe({
            // this.api.addService(sla).subscribe({
            next: () => {
                // TODO return in the backend the service and add it in the effect
                this.store.dispatch(postServiceSuccess({ service: sla }));
                void this.router.navigate(['/control']).then();
                this.notifyService.notify(NotificationType.success, 'Service generation was successful');
            },
            error: () => this.notifyService.notify(NotificationType.error, 'File was not in the correct format'),
        });
    }
}
