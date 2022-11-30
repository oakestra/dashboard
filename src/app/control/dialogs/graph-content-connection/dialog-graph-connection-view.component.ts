import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';

@Component({
    selector: 'dialog-graph-example-dialog',
    templateUrl: 'dialog-graph-connection-settings.html',
    styles: [
        '.full-width{width: 100%}',
        '.alignRight{text-align: right}',
        '.alignCenter{text-align: center}',
        '::ng-deep .blackRadio .mat-radio-outer-circle{border-color: black}',
        '.input{padding-right: 8px}',
        '.deleteButton{background-color: #e07074}',
        '.cancelButton{background-color: #7b97a5}',
        '.updateButton{background-color: #4a7083}',
        'radioDiv{padding-bottom: 32px; margin: 20px 0 20px 0}',
        'content{display: flex; padding-top: 20px}',
    ],
})
export class DialogGraphConnectionView {
    canViewLatConstrains = true;

    constructor(public dialogRef: MatDialogRef<DialogGraphConnectionView>, @Inject(MAT_DIALOG_DATA) public data: any) {}

    onRadioChange(event: MatRadioChange) {
        this.canViewLatConstrains = event.value === 1;
    }

    cancel() {
        this.dialogRef.close({ event: 'Cancel' });
    }

    save() {
        this.dialogRef.close({ event: 'Save', data: this.data });
    }

    switchStartAndTarget() {
        this.dialogRef.close({ event: 'Switch' });
    }

    delete() {
        this.dialogRef.close({ event: 'Delete' });
    }
}
