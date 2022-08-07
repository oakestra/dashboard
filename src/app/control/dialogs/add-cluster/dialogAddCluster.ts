import {Component, Inject, Input, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatDialog} from "@angular/material/dialog";
import * as L from 'leaflet';
import * as LS from 'leaflet-search';

export const DEFAULT_LAT = 48.20807;
export const DEFAULT_LON =  16.37320;
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
  latitude = 51.678418;
  longitude = 7.809007;
  locationChosen = false;
  mapOpenLocation: any;
  zoom: number = 8;

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
  private map:any;
  @Input() lat: number = DEFAULT_LAT;
  @Input() lon: number = DEFAULT_LON;
  @Input() titulo: string = title ;

  ngOnInit(): void {
    this.initMap();
  }



  private initMap(): void {
    //configuración del mapa
    this.map = L.map('map', {
      center: [this.lat, this.lon],
      attributionControl: false,
      zoom: 14
    });

    //iconos personalizados
    var iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    });

    //marca con pop up
    const lon = this.lon + 0.009;
    const lat = this.lat + 0.009;
    const marker = L.marker([lat + 0.005, lon + 0.005]).bindPopup(this.titulo);
    marker.addTo(this.map);

    //marca forma de circulo
    const mark = L.circleMarker([this.lat, this.lon]).addTo(this.map);
    mark.addTo(this.map);


    //ruta
    L.Routing.control({
      router: L.Routing.osrmv1({
        serviceUrl: `https://router.project-osrm.org/route/v1/`
      }),
      showAlternatives: true,
      fitSelectedRoutes: false,
      show: false,
      routeWhileDragging: true,
      waypoints: [
        L.latLng(this.lat, this.lon),
        L.latLng(lat, lon)
      ]
    }).addTo(this.map);
    tiles.addTo(this.map);

    const searchLayer = LS.layerGroup().addTo(this.map);
//... adding data in searchLayer ...
    this.map.addControl( new LS.Control.Search({layer: searchLayer}) );
  }

  doAction() {
    console.log(this.local_data)
    this.dialogRef.close({event: this.action, data: this.local_data});

  }

  onChoseLocation({$event}: { $event: any }) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.locationChosen = true;
    this.local_data.cluster_latitude = this.latitude;
    this.local_data.cluster_longitude = this.longitude;
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

