import { Component, Inject } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogGraphConnectionView } from '../graph-content-connection/dialog-graph-connection-view.component';

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-connection-settings.html',
  styles: [
    '.full-width{width: 100%}',
    '.alignCenter{text-align: center}',
    '::ng-deep .blackRadio .mat-radio-outer-circle{border-color: black}',
    'radioDiv{padding-bottom: 32px; margin: 20px 0 20px 0}',
    '.cancelButton{background-color: #7b97a5}',
    '.deleteButton{background-color: #e07074}',
  ],
})
export class DialogConnectionSettingsView {
  constructor(public dialogRef: MatDialogRef<DialogGraphConnectionView>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  canViewLatConstrains = true;

  onRadioChange(event: MatRadioChange) {
    this.canViewLatConstrains = event.value === 1;
  }

  cancel() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
