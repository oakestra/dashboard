import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatDialog} from "@angular/material/dialog";
import {DialogGenerateTokenView} from "../generate-token/dialogGenerateToken";

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialog-add-cluster.html',
  styleUrls: ['./dialog-add-cluster.css'],
  styles: [
    '.full-width{width: 100%}',
    '.alignRight{text-align: right}'
  ]
})

export class DialogAddClusterView {

  action: string;
  local_data: any;
  title = "Add Cluster"
  latitude = 51.678418;
  longitude = 7.809007;
  locationChosen = false;

  constructor (
    public dialogRef: MatDialogRef<DialogAddClusterView>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog){
    this.local_data = {...data};
    this.action = this.local_data.action;

    if (this.action == 'Add Cluster') {
      this.title = "Add Cluster"
    }
    /*if (this.action == 'Update') {
  this.title = "Modify Cluster"
}*/
    }


  doSomething(){};

  doAction() {
    console.log(this.local_data)
    this.dialogRef.close({event: this.action, data: {'clusters': [this.local_data]}});
    const dialogRef2 = this.dialog.open(DialogGenerateTokenView,
      {
        height: '40%',
        width: '60%'
      });

    dialogRef2.afterClosed().subscribe(result => {
      this.doSomething();
    });
    return
  }

  onChoseLocation(event: any) {
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.locationChosen = true;
  }

  deleteCluster() {
    this.dialogRef.close({event: 'Delete', data: this.local_data});
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }
}
