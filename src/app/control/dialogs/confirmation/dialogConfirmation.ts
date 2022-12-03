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
