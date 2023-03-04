import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { IInstance } from '../../../root/interfaces/instance';

@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'dialog-service-status.html',
    styles: ['.full-width{width: 100%}', '.alignRight{text-align: right}', 'h2{min-width: 70vw}'],
})
export class DialogServiceStatusView {
    // assuming grafana is running on port 80
    tmp = environment.apiUrl.split(':');
    grafanaLink = this.tmp[0] + ':' + this.tmp[1];
    instance: IInstance;

    constructor(
        public dialogRef: MatDialogRef<DialogServiceStatusView>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.instance = { ...data } as IInstance;
        // TODO The instance stores only the current data, without history.
        // change it to array, in the database, if historic data should also be displayed
    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
