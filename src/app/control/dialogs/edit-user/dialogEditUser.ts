import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IUser, IUserRole } from '../../../root/interfaces/user';
import { DialogAction } from '../../../root/enums/dialogAction';
import { Role } from '../../../root/enums/roles';
import { IDialogAttribute } from '../../../root/interfaces/dialogAttribute';

@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'dialog-edit-user.html',
})
export class DialogEditUserView {
    DialogAction = DialogAction;
    action: DialogAction;
    user: IUser;
    title: string;
    form: FormGroup;
    buttonText = '';

    constructor(
        public dialogRef: MatDialogRef<DialogEditUserView>,
        private fb: FormBuilder,
        private datePipe: DatePipe,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: IDialogAttribute,
    ) {
        this.user = data.content as IUser;
        this.action = data.action;
        this.title = 'Editing user...';

        if (this.data.action === DialogAction.UPDATE) {
            this.buttonText = 'Save changes';

            this.form = fb.group({
                name: [this.user.name],
                email: [this.user.email],
                roles: fb.group({
                    ADMIN: this.user.roles.some((r: IUserRole) => r.name === 'Admin'),
                    APPLICATION_PROVIDER: this.user.roles.some((r: IUserRole) => r.name === 'Application_Provider'),
                    INFRASTRUCTURE_PROVIDER: this.user.roles.some(
                        (r: IUserRole) => r.name === 'Infrastructure_Provider',
                    ),
                }),
            });
        } else {
            this.buttonText = 'Create';
            this.title = 'Create new user...';

            this.form = fb.group({
                name: ['', UserValidators.containsWhitespace],
                email: [''],
                password: [''],
                roles: fb.group({
                    ADMIN: false,
                    APPLICATION_PROVIDER: false,
                    INFRASTRUCTURE_PROVIDER: false,
                }),
            });
        }
    }

    get name() {
        return this.form.get('name');
    }

    doAction() {
        const newRoles: IUserRole[] = [];
        const date = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm') ?? '';
        for (const r of Object.keys(Role)) {
            if (this.form.value.roles[r]) {
                // newRoles.push(r);
                // TODO Add real roles | or change how to store a role, a simple string array would be better
            }
        }
        const user: IUser = {
            _id: this.user._id,
            created_at: date,
            email: this.form.value.email,
            password: this.form.value.password,
            roles: newRoles,
            name: this.form.value.name,
        };
        this.dialogRef.close({ event: this.action, data: user });
    }

    closeDialog() {
        this.dialogRef.close({ event: DialogAction.CANCEL });
    }
}

export class UserValidators {
    static containsWhitespace(control: AbstractControl): Validators | null {
        if ((control.value as string).indexOf(' ') > 0) {
            return { containsWhitespace: true };
        } else {
            return null;
        }
    }
}
