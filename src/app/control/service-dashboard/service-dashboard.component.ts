import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { NbDialogService, NbMenuService } from '@nebular/theme';
import { filter } from 'rxjs/operators';
import { ApiService } from '../../shared/modules/api/api.service';
import { IService } from '../../root/interfaces/service';
import { IApplication } from '../../root/interfaces/application';
import { selectApplications, selectCurrentApplication } from '../../root/store/selectors/application.selector';
import { appReducer, getApplication, getServices, setCurrentApplication } from '../../root/store';
import { selectCurrentServices } from '../../root/store/selectors/service.selector';
import { IId } from '../../root/interfaces/id';
import { DialogAction } from '../../root/enums/dialogAction';
import { selectCurrentUser } from '../../root/store/selectors/user.selector';

@Component({
    selector: 'dev-home',
    templateUrl: './service-dashboard.component.html',
    styleUrls: ['./service-dashboard.component.scss'],
})
export class ServiceDashboardComponent implements OnInit {
    @Input() userID: string;
    DialogAction = DialogAction;
    activeAppId: IId;
    public apps$: Observable<IApplication[]> = this.store.pipe(select(selectApplications));
    public currentApp$: Observable<IApplication> = this.store.pipe(select(selectCurrentApplication));
    public services$: Observable<IService[]> = this.store.pipe(select(selectCurrentServices));
    appId = '';
    isLoading = false;

    selectedItem: IApplication;

    constructor(
        private router: Router,
        private api: ApiService,
        public dialog: NbDialogService,
        private store: Store<appReducer.AppState>,
        private nbMenuService: NbMenuService,
    ) { }

    ngOnInit(): void {
        this.store
            .select(selectCurrentUser)
            .pipe(
                filter((u) => !!u),
                tap((u) => this.store.dispatch(getApplication({ id: u._id.$oid }))),
            )
            .subscribe();

        this.store
            .select(selectApplications)
            .pipe(
                filter((app) => app.length > 0),
                tap((app) => {
                    this.store.dispatch(setCurrentApplication({ application: app[0] }));
                    this.selectedItem = app[0];
                }),
            )
            .subscribe();
    }

    setCurrentApplication() {
        this.store.dispatch(setCurrentApplication({ application: this.selectedItem }));
        this.appId = this.selectedItem._id.$oid;
    }

    deployService(service: IService) {
        this.isLoading = true;
        this.api
            .deployService(service)
            .pipe(
                tap(() => {
                    if (this.selectedItem._id.$oid !== '') {
                        setTimeout(() => {
                            this.isLoading = false;
                            this.store.dispatch(getServices({ appId: this.selectedItem._id.$oid }));
                        }, 5000); // delay to wait until the backend has deployed the service
                    }
                }),
            )
            .subscribe();
    }

    deployAllServices() {
        this.services$.pipe(take(1)).subscribe((services) => {
            services.forEach((service) => {
                this.deployService(service);
            });
        });
    }
}
