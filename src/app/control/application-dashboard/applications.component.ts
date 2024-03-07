import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { NbDialogService } from '@nebular/theme';
import { IId } from '../../root/interfaces/id';
import { IApplication } from '../../root/interfaces/application';
import { selectApplications } from '../../root/store/selectors/application.selector';
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
import { DialogAction } from '../../root/enums/dialogAction';
import { selectCurrentUser } from '../../root/store/selectors/user.selector';
import { DialogAddApplicationView } from './dialogs/add-appllication/dialogAddApplication';

@Component({
    selector: 'app-applications',
    templateUrl: './applications.component.html',
    styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent {
    @Input() userID: string;
    DialogAction = DialogAction;
    activeAppId: IId;

    public apps$: Observable<IApplication[]> = this.store.pipe(select(selectApplications));

    constructor(
        public dialog: NbDialogService,
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
            }
            // TODO remove this and get the id form the api response
            this.store.dispatch(getApplication({ id: this.userID }));
        });
    }
}
