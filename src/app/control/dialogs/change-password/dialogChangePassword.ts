import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../../../shared/modules/api/api.service";
import {NotificationService, Type} from "../../../shared/modules/notification/notification.service";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-change-password.html',
  styles: [
    '.full-width{width: 100%}',
    '.alignRight{text-align: right}',
    '.mat-dialog-actions {justify-content: center}'
  ]
})

export class DialogChangePasswordView {

  action: string;
  local_data: any;

  form = new FormGroup({
    'oldPassword': new FormControl("", Validators.required),
    'newPassword': new FormControl("", Validators.required),
    'confirmNewPassword': new FormControl("", Validators.required)
  }, [PasswordValidators.oldAndNewPassDifferent, PasswordValidators.newPasswordsSame])

  constructor(
    public dialogRef: MatDialogRef<DialogChangePasswordView>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    public notifyService: NotificationService) {

    console.log(data);
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  get oldPassword() {
    return this.form.get('oldPassword')
  }

  get newPassword() {
    return this.form.get('newPassword')
  }

  get confirmNewPassword() {
    return this.form.get('confirmNewPassword')
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }

  updatePassword(): void {
    const username = this.local_data.name
    this.api.changePassword(username, this.oldPassword?.value, this.newPassword?.value).subscribe(() => {
      this.notifyService.notify(Type.success, "Password changed");
      this.closeDialog()
    });
  }
}

export class PasswordValidators {

  static oldAndNewPassDifferent(control: AbstractControl): Validators | null {
    if (control.get('oldPassword')?.value != control.get('newPassword')?.value) {
      return null;
    } else {
      return {oldAndNewPassDifferent: true}
    }
  }

  static newPasswordsSame(control: AbstractControl): Validators | null {
    if (control.get('confirmNewPassword')?.value == control.get('newPassword')?.value) {
      return null;
    } else {
      return {newPasswordsSame: true}
    }
  }
}
