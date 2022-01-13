import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-job-status.html',
  styles: [
    '.full-width{width: 100%}',
    '.alignRight{text-align: right}'
  ]
})

export class DialogJobStatusView {

  // TODO Load real data form DB
  information: any = {
    aggregated_cpu_percent: "xyz",
    aggregated_memory_percent: "xyz",
    memory_in_mb: "xyz",
    total_cpu_cores: "xyz"
  };

  status: string = ""
  details = ""
  _statusDetails: Map<string, string> = new Map<string, string>();

  constructor(public dialogRef: MatDialogRef<DialogJobStatusView>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    let local_data = {...data};
    this.status = local_data.status

    this._statusDetails.set("REGISTERED", "The job is stored in the Database but not deployed")
    this._statusDetails.set("DEPLOY REQUESTED", "The deployment is requested and the system tries to deploy the job")
    this._statusDetails.set("SCHEDULED", "The scheduler took a decision")
    this._statusDetails.set("RUNNING", "The service is running and no error occurred")
    this._statusDetails.set("FAILED", "An error came up")

    this.details = this._statusDetails.get(this.status)!
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }
}
