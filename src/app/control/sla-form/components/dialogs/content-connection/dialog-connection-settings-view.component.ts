import { Component, Input } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { NbDialogRef } from '@nebular/theme';
import { DialogGraphConnectionView } from '../../../../dev-home/dialogs/graph-content-connection/dialog-graph-connection-view.component';

@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'dialog-content-connection-settings.html',
    styles: [
        '::ng-deep .blackRadio .mat-radio-outer-circle{border-color: black}',
        'radioDiv{padding-bottom: 32px; margin: 20px 0 20px 0}',
        '.mdc-radio__outer-circle {border-color: black !important}',
    ],
})
export class DialogConnectionSettingsView {
    @Input() data: any;
    canViewLatConstrains = true;

    constructor(public dialogRef: NbDialogRef<DialogGraphConnectionView>) {}

    onRadioChange(event: any) {
        this.canViewLatConstrains = event.value === 1;
    }

    cancel() {
        this.dialogRef.close({ event: 'Cancel' });
    }

    save(data: any) {
        this.dialogRef.close({ event: 'save', data });
    }
}
