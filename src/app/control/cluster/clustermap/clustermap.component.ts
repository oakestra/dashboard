import { Component, Input, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-cluster-map',
  template: '<div class="map" id="map-{{mapId}}" ></div>',
  styleUrls: ['./clustermap.component.scss'],
})
export class ClusterMapComponent implements AfterViewInit,OnInit {

    @Input() location: string;
    @Input() mapId: string;

    constructor() {}

    ngOnInit(): void {
        console.log(this.mapId);
    }

    ngAfterViewInit(): void {
        this.setLocationToMap(this.location);
    }

    private setLocationToMap(locationString: string): void {
       
        const regex =
            /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?),\s*([-+]?(?:\d+)(?:\.\d+)?)$/;
    
        if (regex.test(locationString)) {
            const array = locationString.split(',');
            var longitude = parseFloat(array[0]);
            var latitude = parseFloat(array[1]);
            var radius = parseFloat(array[2]);
            const map = L.map('map-'+this.mapId).setView([longitude, latitude], 14);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map);
            
            const circle = L.circle([longitude, latitude], {
                color: 'blue',
                fillColor: 'lightblue',
                fillOpacity: 0.5,
                radius: radius,
            }).addTo(map);
            
            circle.bindPopup('A Circle on the Map.');

        } 
    }

}