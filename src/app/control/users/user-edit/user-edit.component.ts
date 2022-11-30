import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogChangePasswordView } from '../../dialogs/change-password/dialogChangePassword';
import { UserService } from '../../../shared/modules/auth/user.service';
import { ApiService } from '../../../shared/modules/api/api.service';
import { NotificationService } from '../../../shared/modules/notification/notification.service';
import { IUser } from '../../../root/interfaces/user';
import { IDialogAttribute } from '../../../root/interfaces/dialogAttribute';
import { NotificationType } from '../../../root/interfaces/notification';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
    form: FormGroup;
    user: IUser;
    dataReady = false;

    constructor(
        private fb: FormBuilder,
        public dialog: MatDialog,
        private userService: UserService,
        private api: ApiService,
        private router: Router,
        private notifyService: NotificationService,
    ) {
        this.form = fb.group({
            email: ['', Validators.email],
        });
    }

    ngOnInit(): void {
        const username = this.userService.getUsername();
        this.api.getUserByName(username).subscribe((data: IUser) => {
            this.user = data;
            this.dataReady = true;
            this.form.patchValue({ email: this.user.email });
        });
    }

    onSubmit() {
        this.user.email = this.form.get('email')?.value;
        this.api.updateUser(this.user).subscribe(() => {
            this.notifyService.notify(NotificationType.success, 'Changes saved successfully');
            void this.router.navigate(['/control']).then();
        });
    }

    openDialog(user: IUser) {
        const data: IDialogAttribute = {
            content: user,
        };
        this.dialog.open(DialogChangePasswordView, { data });
    }
}
