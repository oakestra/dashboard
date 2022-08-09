import {Component, Inject, Input, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'node_modules/leaflet-geosearch/dist/geosearch.css';
import {GeoSearchControl, OpenStreetMapProvider, SearchControl, SearchElement} from 'leaflet-geosearch';
import {FormControl} from "@angular/forms";

// FMI Garching coordinates
export const DEFAULT_LAT = 48.262707753772624;
export const DEFAULT_LON =  11.668009155278707;
export const title = 'Project';
const iconRetinaUrl = 'assets/maps/marker-icon-2x.png';
const iconUrl = 'assets/maps/marker-icon.png';
const shadowUrl = 'assets/maps/marker-shadow.png';

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialog-add-cluster.html',
  styleUrls: ['./dialog-add-cluster.css'],
  styles: [
    '.full-width{width: 100%}',
    '.alignRight{text-align: right}'
  ]
})

export class DialogAddClusterView implements OnInit {
  action: string;
  local_data: any;
  title = "Add Cluster"
  locationChosen = false;
  mapOpenLocation: any;
  zoom: number = 8;

  lat_form = new FormControl();
  lng_form = new FormControl();

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
  private map: any;
  @Input() lat: number = DEFAULT_LAT;
  @Input() lon: number = DEFAULT_LON;

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.lat, this.lon],
      attributionControl: false,
      zoom: 14
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    let coord = "Latitude: " + this.lat + ". Longitude: " + this.lon
    L.marker([this.lat, this.lon]).addTo(this.map).bindPopup(coord);

    L.circleMarker([this.lat, this.lon]).addTo(this.map).addTo(this.map).bindPopup(coord);

    // Search location in map
    let search = GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      marker: {
        // optional: L.Marker    - default L.Icon.Default
        draggable: true,
      },

    });
    this.map.addControl(search);

    this.map.on('click', (e: any) => {
      const marker = L.marker([e.latlng.lat, e.latlng.lng]).bindPopup("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
      marker.addTo(this.map);
      this.lat_form.setValue(e.latlng.lat.toString())
      this.lng_form.setValue(e.latlng.lng.toString())
    });

  }

  ngOnInit(): void {
    this.initMap();
  }

  doAction() {
    console.log(this.local_data)
    this.dialogRef.close({event: this.action, data: this.local_data});

  }

  markerDragEnd($event: { $event: any }) {
    console.log("dragEnd", $event);
  }

  deleteCluster() {
    this.dialogRef.close({event: 'Delete', data: this.local_data});
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }

}

