import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-add-application.html',
  styles: [
    '.full-width{width: 100%}',
    '.alignRight{text-align: right}'
  ]
})

export class DialogAddApplicationView {

  action: string;
  local_data: any;
  title = "Add Application"

  constructor(
    public dialogRef: MatDialogRef<DialogAddApplicationView>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = {...data};
    this.action = this.local_data.action;
    if (this.action == 'Update') {
      this.title = "Modify Application"
    }
  }

  doAction() {
    this.dialogRef.close({event: this.action, data: this.local_data});
  }

  deleteApplication() {
    this.dialogRef.close({event: 'Delete', data: this.local_data});
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }
}
