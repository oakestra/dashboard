import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/modules/api/api.service';
import { NotificationService } from '../../shared/modules/notification/notification.service';
import { IApplication } from '../../root/interfaces/application';
import { IService } from '../../root/interfaces/service';
import { appReducer, postService, updateServiceSuccess } from '../../root/store';
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
    selector: 'sla-form',
    templateUrl: './sla-form.component.html',
    styleUrls: ['./sla-form.component.scss'],
})
export class SlaFormComponent implements OnInit {
    @ViewChild('serviceInfo') serviceInfo: ServiceInfoComponent;
    @ViewChild('requirements') requirements: RequirementsComponent;
    @ViewChild('addresses') addresses: AddressesComponent;
    @ViewChild('arguments') arguments: ArgumentsComponent;
    @ViewChild('constraints') constraints: ConstraintsComponent;
    @ViewChild('connectivity') connectivity: ConnectivityComponent;
    @ViewChild('fileSelect') fileSelect: FileSelectComponent;

    public serviceId: string;

    editingService = false; // True if the user is editing the service

    app$: Observable<IApplication> = this.store.pipe(select(selectCurrentApplication));
    currentApplication: IApplication;

    currentUser$: Observable<IUser> = this.store.pipe(select(selectCurrentUser));
    currentUser: IUser;

    services$: Observable<IService[]> = this.store.pipe(select(selectCurrentServices));
    service: IService;

    constructor(
        private route: ActivatedRoute,
        private api: ApiService,
        private router: Router,
        private notifyService: NotificationService,
        private store: Store<appReducer.AppState>,
        private slaGenerator: SlaGeneratorService,
        private serviceGenerator: ServiceGeneratorService,
    ) {
        this.app$.subscribe((app) => {
            console.log(app);
            this.currentApplication = app;
        });
    }

    ngOnInit() {
        this.serviceId = this.route.snapshot.paramMap.get('id');
        this.currentUser$.subscribe((user) => (this.currentUser = user));
        this.services$.subscribe({
            next: (services: IService[]) => {
                const s = services.filter((s: IService) => s._id?.$oid === this.serviceId);
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

        console.log(sla);
        console.log(this.editingService);
        if (this.editingService) {
            this.updateService(sla);
        } else {
            this.addService(sla);
        }
    }

    slaFromFile(microservices: IService[]) {
        microservices.map((service) => {
            console.log(service);
            const sla = this.slaGenerator.generateSLA(service, this.currentApplication, this.currentUser);
            this.addService(sla);
        });
    }

    updateService(sla: any) {
        this.api.updateService(sla, this.serviceId).subscribe({
            next: () => {
                // TODO This is not the correct way, update the store properly
                this.store.dispatch(updateServiceSuccess(sla));
                void this.router.navigate(['/control/services']).then();
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    addService(sla: any) {
        this.store.dispatch(postService({ service: sla }));
    }
}
