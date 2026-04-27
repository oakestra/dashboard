import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
    standalone: false,
    selector: 'app-cluster-map',
    template: '<div class="map" #mapContainer></div>',
    styleUrls: ['./clustermap.component.scss'],
})
export class ClusterMapComponent implements AfterViewInit, OnDestroy {

    @Input() location: string;
    @ViewChild('mapContainer') mapContainer: ElementRef<HTMLDivElement>;

    private map?: L.Map;

    ngAfterViewInit(): void {
        this.setLocationToMap(this.location);
    }

    ngOnDestroy(): void {
        this.map?.remove();
    }

    private setLocationToMap(locationString: string): void {

        const regex =
            /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?),\s*([-+]?(?:\d+)(?:\.\d+)?)$/;

        if (regex.test(locationString)) {
            const array = locationString.split(',');
            const longitude = parseFloat(array[0]);
            const latitude = parseFloat(array[1]);
            const radius = parseFloat(array[2]);
            this.map?.remove();
            this.map = L.map(this.mapContainer.nativeElement).setView([longitude, latitude], 14);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(this.map);

            const circle = L.circle([longitude, latitude], {
                color: 'blue',
                fillColor: 'lightblue',
                fillOpacity: 0.5,
                radius,
            }).addTo(this.map);

            circle.bindPopup('A Circle on the Map.');

        }
    }

}
