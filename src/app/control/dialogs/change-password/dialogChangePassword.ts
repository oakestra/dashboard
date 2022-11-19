import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../shared/modules/api/api.service';
import { NotificationService, Type } from '../../../shared/modules/notification/notification.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../../root/interfaces/user';

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
  action: string;
  user: IUser;

  form = new FormGroup(
    {
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      confirmNewPassword: new FormControl('', Validators.required),
    },
    [PasswordValidators.oldAndNewPassDifferent, PasswordValidators.newPasswordsSame],
  );

  constructor(
    public dialogRef: MatDialogRef<DialogChangePasswordView>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    public notifyService: NotificationService,
  ) {
    this.user = { ...data } as IUser;
    this.action = data.action;
  }

  get oldPassword() {
    return this.form.get('oldPassword');
  }

  get newPassword() {
    return this.form.get('newPassword');
  }

  get confirmNewPassword() {
    return this.form.get('confirmNewPassword');
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  updatePassword(): void {
    const username = this.user.name;
    // TODO Fix this try to use Formbuilder
    this.api.changePassword(username, this.oldPassword?.value!, this.newPassword?.value!).subscribe(() => {
      this.notifyService.notify(Type.success, 'Password changed');
      this.closeDialog();
    });
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
