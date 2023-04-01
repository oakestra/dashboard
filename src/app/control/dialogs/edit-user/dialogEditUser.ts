import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IUser } from '../../../root/interfaces/user';
import { DialogAction } from '../../../root/enums/dialogAction';
import { Role } from '../../../root/enums/roles';
import { IDialogAttribute } from '../../../root/interfaces/dialogAttribute';

@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'dialog-edit-user.html',
})
export class DialogEditUserView {
    DialogAction = DialogAction;
    roles = Object.values(Role);
    action: DialogAction;
    user: IUser;
    title: string;
    form: FormGroup;
    buttonText = '';
    roleOptions: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<DialogEditUserView>,
        private fb: FormBuilder,
        private datePipe: DatePipe,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: IDialogAttribute,
    ) {
        this.user = data.content as IUser;
        this.action = data.action;
        this.title = 'Editing user...';

        this.roleOptions = this.fb.group(
            this.roles.reduce((obj: any, entry) => {
                obj[entry] = this.getRoleOptions(entry);
                return obj;
            }, {}),
        );

        if (this.data.action === DialogAction.UPDATE) {
            this.form = fb.group({
                name: [this.user.name],
                email: [this.user.email],
                password: [this.user.password],
                roles: [this.user.roles],
            });

            this.buttonText = 'Save changes';
            this.form.get('name').disable();
        } else {
            this.buttonText = 'Create';
            this.title = 'Create new user...';

            this.form = fb.group({
                name: ['', UserValidators.containsWhitespace],
                email: [''],
                password: [''],
                roles: [this.roleOptions],
            });
        }
    }

    get name() {
        return this.form.get('name');
    }

    private getRoleOptions(role: Role) {
        return this.user.roles.includes(role);
    }

    doAction() {
        const date = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm') ?? '';
        const r = Object.keys(this.roleOptions.value).filter((key) => this.roleOptions.value[key]) as Role[];

        const user: IUser = {
            _id: this.user._id,
            created_at: date,
            email: this.form.value.email,
            password: this.form.value.password,
            roles: r,
            name: this.form.value.name ?? this.user.name,
        };
        this.dialogRef.close({ event: this.action, data: user });
    }

    closeDialog() {
        this.dialogRef.close({ event: DialogAction.CANCEL });
    }

    downloadCredentials() {
        const setting = {
            element: {
                dynamicDownload: null as any,
            },
        };

        const config = {
            ...this.form.getRawValue(),
        };
        delete config.roles;
        console.log(config);

        const fileName = 'credentials.json';
        if (!setting.element.dynamicDownload) {
            setting.element.dynamicDownload = document.createElement('a');
        }
        const element = setting.element.dynamicDownload;
        const fileType = fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
        element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(JSON.stringify(config))}`);
        element.setAttribute('download', fileName);
        const event = new MouseEvent('click');
        element.dispatchEvent(event);
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
