import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbColorHelper, NbThemeService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { Chart } from 'chart.js';
import { IHistoricalData, IInstance } from '../../../../root/interfaces/instance';

@Component({
    selector: 'chart-memory-line',
    template: ' <canvas id="myChartMemory"></canvas> ',
})
export class ChartMemoryLineComponent implements OnDestroy, OnInit {
    @Input() instance$: Observable<IInstance>;
    data: any;
    options: any;
    themeSubscription: any;
    private memoryChart: Chart;

    constructor(private theme: NbThemeService) { }

    ngOnInit(): void {
        this.createCharts();
        this.instance$.subscribe((instance: IInstance) => {
            this.updateCharts(instance);
            console.log(instance);
        });
    }

    createCharts() {
        this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
            const colors: any = config.variables;
            const chartjs: any = config.variables.chartjs;

            this.data = {
                labels: [],
                datasets: [
                    {
                        data: [],
                        label: 'Memory usage [mB]',
                        backgroundColor: NbColorHelper.hexToRgbA(colors.danger, 0.3),
                        borderColor: colors.danger,
                    },
                ],
            };

            this.options = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: true,
                                color: chartjs.axisLineColor,
                            },
                            ticks: {
                                fontColor: chartjs.textColor,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                display: true,
                                color: chartjs.axisLineColor,
                            },
                            ticks: {
                                fontColor: chartjs.textColor,
                            },
                        },
                    ],
                },
                legend: {
                    labels: {
                        fontColor: chartjs.textColor,
                    },
                },
            };

            this.memoryChart = new Chart('myChartMemory', {
                type: 'line',
                data: this.data,
                options: this.options,
            });
        });
    }

    private updateCharts(instance: IInstance): void {
        let sampledHistory: IHistoricalData[];
        if (instance.memory_history.length === 100) {
            sampledHistory = [];
            for (let i = 0; i < 10; i++) {
                sampledHistory.push(instance.memory_history[i * 10]);
            }
        } else {
            sampledHistory = instance.memory_history.slice(Math.max(instance.memory_history.length - 10, 0));
        }

        const timeLables = sampledHistory.map((data: IHistoricalData) => {
            const d = new Date(data.timestamp);
            return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d
                .getSeconds()
                .toString()
                .padStart(2, '0')}`;
        });
        const memoryData = sampledHistory.map((data) => Number.parseFloat(data.value) / 1000000);

        this.memoryChart.data.datasets.forEach((dataset) => {
            dataset.data = memoryData;
        });
        this.memoryChart.data.labels = timeLables;
        this.memoryChart.update();
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }
}
