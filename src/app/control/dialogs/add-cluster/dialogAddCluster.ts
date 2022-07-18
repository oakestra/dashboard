import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-add-cluster.html',
  styles: [
    '.full-width{width: 100%}',
    '.alignRight{text-align: right}'
  ]
})

export class DialogAddClusterView {

  action: string;
  local_data: any;
  title = "Add Cluster"

  constructor(
    public dialogRef: MatDialogRef<DialogAddClusterView>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = {...data};
    this.action = this.local_data.action;

    if (this.action == 'Add Cluster') {
      this.title = "Add Cluster"
    }
    /*if (this.action == 'Update') {
  this.title = "Modify Cluster"
}*/
  }

  doAction() {
    console.log(this.local_data)
    //this.dialogRef.close({event: this.action, data: {'clusters': [this.local_data]}});
  }

  deleteCluster() {
    //this.dialogRef.close({event: 'Delete', data: this.local_data});
  }

  closeDialog() {
    //this.dialogRef.close({event: 'Cancel'});
  }
}
