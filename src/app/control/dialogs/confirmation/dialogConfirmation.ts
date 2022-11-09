import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogGraphConnectionSettings} from "../graph-content-connection/dialogGraphConnectionSettings";

@Component({
  selector: 'dialog-conformation-dialog',
  templateUrl: 'dialog-confirmation.html',
  styles: [
    '.full-width{width: 100%}',
    '.alignRight{text-align: right}',
  ]
})
export class DialogConfirmation {

  text = ""
  type = ""

  constructor(public dialogRef: MatDialogRef<DialogGraphConnectionSettings>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.text = data.text
    this.type = data.type
  }

  confirm() {
    this.dialogRef.close({event: true});
  }

  cancel() {
    this.dialogRef.close({event: false});
  }
}
