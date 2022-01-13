import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatRadioChange} from "@angular/material/radio";

@Component({
  selector: 'dialog-graph-example-dialog',
  templateUrl: 'dialog-graph-connection-settings.html',
  styles: [
    '.full-width{width: 100%}',
    '.alignRight{text-align: right}',
    '.test .mat-radio-outer-circle{border-color: red}'
  ]
})
export class DialogGraphConnectionSettings {

  canViewLatConstrains: boolean = true;

  constructor(public dialogRef: MatDialogRef<DialogGraphConnectionSettings>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onRadioChange(event: MatRadioChange) {
    this.canViewLatConstrains = event.value == 1;
  }

  cancel() {
    this.dialogRef.close({event: 'Cancel'});
  }

  save() {
    this.dialogRef.close({event: 'Save', data: this.data});
  }

  switchStartAndTarget() {
    this.dialogRef.close({event: 'Switch'});
  }

  delete() {
    this.dialogRef.close({event: 'Delete'});
  }
}
