import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as L from 'leaflet';
import {
    ArcElement,
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    Decimation,
    DoughnutController,
    Filler,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { IInstance } from '../../../root/interfaces/instance';

@Component({
    selector: 'app-chart',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit, AfterViewInit {
    @Input() instanceList: Observable<IInstance>;

    private cpuChart: Chart;
    private memoryChart: Chart;

    textLocation: string = null;
    private latitude: number;
    private longitude: number;
    private radius: number;

    constructor() {
        Chart.register(
            LineElement,
            LineController,
            PointElement,
            BarElement,
            BarController,
            CategoryScale,
            Decimation,
            Filler,
            Legend,
            Title,
            Tooltip,
            LinearScale,
            DoughnutController,
            ArcElement,
        );
    }

    ngOnInit(): void {
        this.createCharts();
        this.instanceList.subscribe((instance: IInstance) => {
            this.setLocation(instance.cluster_location);
            this.updateCharts(instance);
        });
    }

    ngAfterViewInit() {
        const map = L.map('map').setView([this.longitude, this.latitude], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const circle = L.circle([this.longitude, this.latitude], {
            color: 'blue',
            fillColor: 'lightblue',
            fillOpacity: 0.5,
            radius: this.radius,
        }).addTo(map);

        circle.bindPopup('A Circle on the Map.');
    }

    private setLocation(locationString: string): void {
        if (!locationString) {
            this.textLocation = 'No location found';
            return;
        }
        const regex =
            /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?),\s*([-+]?(?:\d+)(?:\.\d+)?)$/;

        if (regex.test(locationString)) {
            const array = locationString.split(',');
            this.longitude = parseFloat(array[1]);
            this.latitude = parseFloat(array[2]);
            this.radius = parseFloat(array[3]);
        } else {
            this.textLocation = locationString;
        }
    }

    private updateCharts(instance: IInstance): void {
        this.cpuChart.data.datasets.forEach((dataset) => {
            dataset.data = [instance.cpu, 100 - instance.cpu];
        });
        this.cpuChart.update();

        this.memoryChart.data.datasets.forEach((dataset) => {
            dataset.data = [0, instance.memory]; // TODO Exchange to historic Data Array
        });
        this.memoryChart.update();
    }

    private createCharts(): void {
        this.cpuChart = new Chart('myChartCPU', {
            type: 'doughnut',
            data: {
                labels: ['used', 'free'],
                datasets: [
                    {
                        label: 'usage [%]',
                        data: [0, 0], // only to initialize
                        backgroundColor: ['rgb(235,54,75, 0.8)', 'rgba(90,246,93,0.8)'],
                        hoverOffset: 4,
                    },
                ],
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'CPU usage',
                    },
                },
            },
        });

        this.memoryChart = new Chart('myChartMemory', {
            type: 'line',
            data: {
                labels: [0, 1], // Could be a time stamp
                datasets: [
                    {
                        label: 'Memory [bytes]',
                        data: [0, 0],
                        backgroundColor: 'rgb(36,90,238)',
                        borderColor: 'rgb(36,90,238)',
                        borderWidth: 1,
                        fill: {
                            target: 'origin',
                            above: 'rgb(36,90,238, 0.5)',
                        },
                    },
                ],
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Memory usage',
                    },
                },
            },
        });
    }
}
