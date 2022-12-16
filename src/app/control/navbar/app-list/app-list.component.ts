import { Component, Input, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogAddApplicationView } from '../../dialogs/add-appllication/dialogAddApplication';
import { DialogAction } from '../../../root/enums/dialogAction';
import { NotificationService } from '../../../shared/modules/notification/notification.service';
import { IApplication } from '../../../root/interfaces/application';
import { SharedIDService } from '../../../shared/modules/helper/shared-id.service';
import { ApiService } from '../../../shared/modules/api/api.service';
import { UserService } from '../../../shared/modules/auth/user.service';
import { AuthService } from '../../../shared/modules/auth/auth.service';
import { IService } from '../../../root/interfaces/service';
import { IId } from '../../../root/interfaces/id';
import { IDialogAttribute } from '../../../root/interfaces/dialogAttribute';
import { NotificationType } from '../../../root/interfaces/notification';

@Component({
    selector: 'app-app-list',
    templateUrl: './app-list.component.html',
    styleUrls: ['./app-list.component.css', '../navbar.component.css'],
})
export class AppListComponent implements OnInit {
    DialogAction = DialogAction;
    @Input() userID = '';

    apps: IApplication[];
    activeAppId: IId;

    constructor(
        private observer: BreakpointObserver,
        public dialog: MatDialog,
        public sharedService: SharedIDService,
        private api: ApiService,
        public userService: UserService,
        private router: Router,
        private authService: AuthService,
        private notifyService: NotificationService,
    ) {}

    ngOnInit(): void {
        this.loadDataApplication();
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
                this.addApplication(result.data);
            } else if (result.event === DialogAction.UPDATE) {
                this.updateApplication(result.data.applications[0]);
            } else if (result.event === DialogAction.DELETE) {
                this.deleteApplication(result.data);
            }
        });
    }

    deleteApplication(app: IApplication): void {
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
                this.loadDataApplication();
            },
            error: () => {
                this.notifyService.notify(
                    NotificationType.error,
                    'Error: Deleting application "' + app.application_name + '" failed!',
                );
            },
        });
    }

    addApplication(app: IApplication): void {
        console.log(app);
        console.log('Add');
        this.api.addApplication(app).subscribe({
            next: () => {
                this.loadDataApplication();
            },
            error: () => {
                this.notifyService.notify(
                    NotificationType.error,
                    'Error: Adding application "' + app.application_name + '" failed!',
                );
            },
        });
    }

    updateApplication(app: IApplication): void {
        this.api.updateApplication(app).subscribe({
            next: () => {
                this.notifyService.notify(
                    NotificationType.success,
                    'Application "' + app.application_name + '" updated successfully!',
                );
                this.loadDataApplication();
            },
            error: () => {
                this.notifyService.notify(
                    NotificationType.error,
                    'Error: Updating application "' + app.application_name + '" failed!',
                );
            },
        });
    }

    loadDataApplication() {
        this.api.getApplicationsOfUser(this.userID).subscribe((apps: IApplication[]) => {
            this.apps = apps;
            if (apps[0]) {
                this.activeAppId = apps[0]._id;
                this.sharedService.selectApplication(apps[0]);
            }
        });
    }

    handleChange() {
        this.api.getAppById(this.activeAppId.$oid).subscribe((app) => {
            this.sharedService.selectApplication(app);
            // this.switchScreen(true, false, false); TODO why is this used?
            void this.router.navigate(['/control']).then();
        });
    }
}
