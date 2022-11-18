import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'node_modules/leaflet-geosearch/dist/geosearch.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { FormControl } from '@angular/forms';
import { NotificationService, Type } from '../../../shared/modules/notification/notification.service';

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialog-add-cluster.html',
  styleUrls: ['./dialog-add-cluster.css'],
})

// TODO Check if this code works and improve it
export class DialogAddClusterView implements OnInit {
  action: string;
  local_data: any;
  title = 'Add Cluster';
  zoom = 8;

  lat_form = new FormControl();
  lng_form = new FormControl();
  my_radius = 20;
  marker: any;
  circlemarker: any;

  constructor(
    public dialogRef: MatDialogRef<DialogAddClusterView>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private notifyService: NotificationService,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;

    if (this.action == 'Add') {
      this.title = 'Add Cluster';
    }
    /*if (this.action == 'Update') {
        this.title = "Modify Cluster" }*/
  }
  private map: any;
  // FMI Garching coordinates
  private lat = 48.262707753772624;
  private lon = 11.668009155278707;

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.lat, this.lon],
      attributionControl: false,
      zoom: 14,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    // Search location in map
    let search = GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      marker: {
        draggable: true,
      },
    });
    this.map.addControl(search);

    this.map.on('click', (e: any) => {
      if (this.marker && this.map.hasLayer(this.marker)) this.map.removeLayer(this.marker);

      this.marker = L.marker([e.latlng.lat, e.latlng.lng])
        .bindPopup('Lat, Lon : ' + e.latlng.lat + ', ' + e.latlng.lng)
        .openPopup();

      this.marker.addTo(this.map);
      this.lat_form.setValue(e.latlng.lat.toString());
      this.lng_form.setValue(e.latlng.lng.toString());
      this.lat = e.latlng.lat;
      this.lon = e.latlng.lng;

      if (this.circlemarker && this.map.hasLayer(this.circlemarker)) this.map.removeLayer(this.circlemarker);

      this.circlemarker = L.circleMarker([e.latlng.lat, e.latlng.lng], { radius: this.my_radius });
      this.circlemarker.addTo(this.map).addTo(this.map);
    });
  }

  radiusChange(new_val: any) {
    this.my_radius = new_val.value;
    this.map.removeLayer(this.circlemarker);
    this.circlemarker = L.circleMarker([this.lat, this.lon], { radius: new_val.value });
    this.circlemarker.addTo(this.map).addTo(this.map);
  }

  ngOnInit(): void {
    this.initMap();
  }

  doAction() {
    console.log(this.local_data);

    if (this.local_data['cluster_name'].length < 3) {
      this.notifyService.notify(Type.error, 'Please provide a valid cluster name.');
    } else if (this.local_data['cluster_latitude'] == '' || this.local_data['cluster_longitude'] == '') {
      this.notifyService.notify(Type.error, 'Please provide a valid location.');
    } else {
      this.dialogRef.close({ event: this.action, data: this.local_data });
    }
  }

  deleteCluster() {
    this.dialogRef.close({ event: 'Delete', data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
