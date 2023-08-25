import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
    selector: 'dialog-graph-example-dialog',
    templateUrl: 'dialog-graph-connection-settings.html',
    styles: [
        '.full-width{width: 100%}',
        '.alignRight{text-align: right}',
        '.alignCenter{text-align: center}',
        '.input{padding-right: 8px}',
        'radioDiv{padding-bottom: 32px; margin: 20px 0 20px 0}',
        'content{display: flex; padding-top: 20px}',
    ],
})
export class DialogGraphConnectionView {
    @Input() data: any;
    canViewLatConstrains = true;

    constructor(public dialogRef: NbDialogRef<DialogGraphConnectionView>) {}

    onRadioChange(event: any) {
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
