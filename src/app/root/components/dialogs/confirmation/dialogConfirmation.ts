import { Component, Input, OnInit } from '@angular/core';
import { DialogGraphConnectionView } from '../../../../control/service-dashboard/dialogs/graph-content-connection/dialog-graph-connection-view.component';
import { NbDialogRef } from '@nebular/theme';

interface ConformationText {
    text: string;
    type: string;
}

@Component({
    selector: 'dialog-conformation-dialog',
    templateUrl: 'dialog-confirmation.html',
})
export class DialogConfirmationView implements OnInit {
    @Input() data: ConformationText;
    text = '';
    type = '';

    constructor(public dialogRef: NbDialogRef<DialogGraphConnectionView>) {}

    ngOnInit(): void {
        this.text = this.data.text;
        this.type = this.data.type;
    }

    confirm() {
        this.dialogRef.close({ event: true });
    }

    cancel() {
        this.dialogRef.close({ event: false });
    }
}
