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
        const map = L.map('map').setView([this.longitude, this.latitude], 14);

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
            this.longitude = parseFloat(array[0]);
            this.latitude = parseFloat(array[1]);
            this.radius = parseFloat(array[2]);
            console.log(this.radius);
        } else {
            this.textLocation = locationString;
        }
    }

    private updateCharts(instance: IInstance): void {
        let timeLables = instance.memory_history.map((data) => {
            const d = new Date(data.timestamp.$date);
            return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        });
        timeLables = timeLables.slice(0, 10); // Show only 10 data points

        const cpuData = instance.cpu_history.map((data) => Number.parseFloat(data.value));
        this.cpuChart.data.datasets.forEach((dataset) => {
            dataset.data = cpuData;
        });
        this.cpuChart.update();
        this.cpuChart.data.labels = timeLables;

        const memoryData = instance.memory_history.map((data) => Number.parseFloat(data.value) / 1000000);
        this.memoryChart.data.datasets.forEach((dataset) => {
            dataset.data = memoryData;
        });
        this.memoryChart.data.labels = timeLables;
        this.memoryChart.update();
    }

    private createCharts(): void {
        console.log('Create');
        this.cpuChart = new Chart('myChartCPU', {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'CPU usage [%]',
                        data: [0, 0], // only to initialize
                        borderColor: 'rgba(90,246,93,0.8)',
                        tension: 0.1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 5,
                        },
                    },
                },
            },
        });

        this.memoryChart = new Chart('myChartMemory', {
            type: 'line',
            data: {
                labels: [65, 59, 80, 81, 56, 55, 40],
                datasets: [
                    {
                        label: 'Memory usage [mB]',
                        data: [0, 0], // set in the update function
                        fill: true,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 5,
                        },
                    },
                },
            },
        });
    }
}
