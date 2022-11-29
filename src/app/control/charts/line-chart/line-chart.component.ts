import { Component, Input, OnInit } from '@angular/core';
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

declare function initMap(lng: number, lat: number, radius: number): void;

@Component({
    selector: 'line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit {
    @Input() instance_list: IInstance;

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
        // Doughnut chart with only current value.
        new Chart('myChartCPU', {
            type: 'doughnut',
            data: {
                labels: ['used', 'free'],
                datasets: [
                    {
                        label: 'usage [%]',
                        data: [this.instance_list.cpu, 100 - this.instance_list.cpu],
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

        // TODO Add historic data
        new Chart('myChartMemory', {
            type: 'line',
            data: {
                labels: [0, 1], // Could be a time stamp
                datasets: [
                    {
                        label: 'Memory [bytes]',
                        data: [this.instance_list.memory, this.instance_list.memory],
                        backgroundColor: 'rgb(36,90,238)',
                        borderColor: 'rgb(36,90,238)',
                        borderWidth: 1,
                        fill: {
                            target: 'origin',
                            above: 'rgb(36,90,238, 0.5)', // Area will be red above the origin
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

        // TODO Update map with real values and display only a polygon
        const location_split = this.instance_list.cluster_location.split(',', 3) ?? [];
        if (location_split.length === 3) {
            initMap(+location_split[1], +location_split[0], +location_split[2]);
        } else {
            initMap(0.0, 0.0, 19999999);
        }
    }
}
