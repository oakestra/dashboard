import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NbDialogService } from '@nebular/theme';
import { IId } from '../../root/interfaces/id';
import { IApplication } from '../../root/interfaces/application';
import { selectApplications } from '../../root/store/selectors/application.selector';
import { ApiService } from '../../shared/modules/api/api.service';
import { UserService } from '../../shared/modules/auth/user.service';
import { AuthService } from '../../shared/modules/auth/auth.service';
import { NotificationService } from '../../shared/modules/notification/notification.service';
import {
    appReducer,
    deleteApplication,
    getApplication,
    postApplication,
    setCurrentApplication,
    updateApplication,
} from '../../root/store';
import { IDialogAttribute } from '../../root/interfaces/dialogAttribute';
import { DialogAddApplicationView } from '../navbar/dialogs/add-appllication/dialogAddApplication';
import { DialogAction } from '../../root/enums/dialogAction';
import { selectCurrentUser } from '../../root/store/selectors/user.selector';

@Component({
    selector: 'app-applications',
    templateUrl: './applications.component.html',
    styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent {
    DialogAction = DialogAction;
    @Input() userID: string;
    activeAppId: IId;
    public apps$: Observable<IApplication[]> = this.store.pipe(select(selectApplications));

    constructor(
        private observer: BreakpointObserver,
        public dialog: NbDialogService,
        private api: ApiService,
        public userService: UserService,
        private router: Router,
        private authService: AuthService,
        private notifyService: NotificationService,
        private store: Store<appReducer.AppState>,
    ) {}

    ngOnInit(): void {
        this.store.select(selectCurrentUser).subscribe((u) => {
            this.userID = u._id.$oid;
            this.store.dispatch(getApplication({ id: this.userID }));
        });

        this.apps$.subscribe((apps) => {
            console.log(apps);
            const active = apps.filter((a) => a._id.$oid === sessionStorage.getItem('id'))[0];
            if (active) {
                this.store.dispatch(setCurrentApplication({ application: active }));
                this.activeAppId = active._id;
            }
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

        const dialogRef = this.dialog.open(DialogAddApplicationView, { context: { data } });

        dialogRef.onClose.subscribe((result) => {
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
