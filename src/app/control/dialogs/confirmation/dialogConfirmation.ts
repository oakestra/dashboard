import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogGraphConnectionView } from '../graph-content-connection/dialog-graph-connection-view.component';

interface ConformationText {
  text: string;
  type: string;
}

@Component({
  selector: 'dialog-conformation-dialog',
  templateUrl: 'dialog-confirmation.html',
  styles: [
    '.full-width{width: 100%}',
    '.alignRight{text-align: right}',
    'deleteText{padding-bottom: 32px; margin: 20px 0 20px 0}',
    '.cancelButton{background-color: #7b97a5}',
    '.deleteButton{background-color: #e07074}',
  ],
})
export class DialogConfirmationView {
  text = '';
  type = '';

  constructor(
    public dialogRef: MatDialogRef<DialogGraphConnectionView>,
    @Inject(MAT_DIALOG_DATA) public data: ConformationText,
  ) {
    this.text = data.text;
    this.type = data.type;
  }

  confirm() {
    this.dialogRef.close({ event: true });
  }

  cancel() {
    this.dialogRef.close({ event: false });
  }
}
