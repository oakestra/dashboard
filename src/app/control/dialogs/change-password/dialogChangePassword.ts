import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../shared/modules/api/api.service';
import { NotificationService, Type } from '../../../shared/modules/notification/notification.service';
import {
    AbstractControl,
    AbstractControlOptions,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { IUser } from '../../../root/interfaces/user';
import { IDialogAttribute } from '../../../root/interfaces/dialogAttribute';

@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'dialog-change-password.html',
    styles: [
        '.full-width{width: 100%}',
        '.alignRight{text-align: right}',
        '.alignCenter{text-align: center}',
        '.mat-dialog-actions {justify-content: center}',
        '.cancelButton{background-color: #7b97a5}',
        '.updateButton{background-color: #4a7083}',
    ],
})
export class DialogChangePasswordView {
    user: IUser;
    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<DialogChangePasswordView>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: IDialogAttribute,
        private api: ApiService,
        public notifyService: NotificationService,
        private fb: FormBuilder,
    ) {
        this.user = data.content as IUser;

        this.form = fb.group(
            {
                oldPassword: new FormControl('', Validators.required),
                newPassword: new FormControl('', Validators.required),
                confirmNewPassword: new FormControl('', Validators.required),
            },
            [PasswordValidators.oldAndNewPassDifferent, PasswordValidators.newPasswordsSame] as AbstractControlOptions,
        );
    }

    get confirmNewPassword() {
        return this.form.get('confirmNewPassword');
    }

    get newPassword() {
        return this.form.get('newPassword');
    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }

    updatePassword(): void {
        const oldPassword = this.form.get('oldPassword');
        const newPassword = this.form.get('newPassword');
        if (oldPassword?.valid && newPassword?.valid) {
            this.api.changePassword(this.user.name, oldPassword.value, newPassword.value).subscribe(() => {
                this.notifyService.notify(Type.success, 'Password changed');
                this.closeDialog();
            });
        }
    }
}

export class PasswordValidators {
    static oldAndNewPassDifferent(control: AbstractControl): Validators | null {
        if (control.get('oldPassword')?.value != control.get('newPassword')?.value) {
            return null;
        } else {
            return { oldAndNewPassDifferent: true };
        }
    }

    static newPasswordsSame(control: AbstractControl): Validators | null {
        if (control.get('confirmNewPassword')?.value == control.get('newPassword')?.value) {
            return null;
        } else {
            return { newPasswordsSame: true };
        }
    }
}
