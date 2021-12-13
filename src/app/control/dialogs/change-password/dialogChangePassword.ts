import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../../../shared/modules/api/api.service";
import {NotificationService, Type} from "../../../shared/modules/notification/notification.service";

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

  newPassword = ""
  oldPassword = ""
  confirmNewPassword = ""

  constructor(
    public dialogRef: MatDialogRef<DialogChangePasswordView>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    public notifyService: NotificationService) {

    console.log(data);
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }

  updatePassword(): void {
    console.log(this.local_data)
    if (this.newPassword !== this.confirmNewPassword) {
      //TODO Add validator
      // this.notify.error("Error", "New/confirmed password aren't the same!");
    }

    const username = this.local_data.name
    this.api.changePassword(username, this.oldPassword, this.newPassword).subscribe((_success: any) => {
      this.notifyService.notify(Type.success, "Password changed");
      this.closeDialog()
    });
  }
}
