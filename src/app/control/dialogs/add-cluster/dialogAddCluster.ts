import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatDialog} from "@angular/material/dialog";

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
  mapOpenLocation: any;

  constructor (
    public dialogRef: MatDialogRef<DialogAddClusterView>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog){
        this.local_data = {...data};
        this.action = this.local_data.action;

        if (this.action == 'Add') {
          this.title = "Add Cluster"
        }
        /*if (this.action == 'Update') {
        this.title = "Modify Cluster" }*/
    }

  doAction() {
    console.log(this.local_data)
    this.dialogRef.close({event: this.action, data: this.local_data});

  }

  onChoseLocation(event: any) {
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.locationChosen = true;
    this.local_data.cluster_latitude = this.latitude;
    this.local_data.cluster_longitude = this.longitude;

  }

  deleteCluster() {
    this.dialogRef.close({event: 'Delete', data: this.local_data});
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }

  markerDragEnd($event: any) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    //this.getAddress(this.latitude, this.longitude);
  }

}

