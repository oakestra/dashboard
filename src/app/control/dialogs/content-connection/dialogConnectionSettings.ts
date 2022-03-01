import {Component, Inject} from '@angular/core';
import {MatRadioChange} from "@angular/material/radio";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogGraphConnectionSettings} from "../graph-content-connection/dialogGraphConnectionSettings";

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-connection-settings.html',
  styles: [
    '.full-width{width: 100%}',
    '.alignRight{text-align: right}',
    '::ng-deep .blackRadio .mat-radio-outer-circle{border-color: black}'
  ]
})
export class DialogConnectionSettings {

  constructor(public dialogRef: MatDialogRef<DialogGraphConnectionSettings>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  canViewLatConstrains: boolean = true;

  onRadioChange(event: MatRadioChange) {
    this.canViewLatConstrains = event.value == 1;
  }

  cancel() {
    this.dialogRef.close({event: 'Cancel'});
  }
}
