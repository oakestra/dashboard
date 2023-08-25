import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbColorHelper, NbThemeService } from '@nebular/theme';
import { Observable } from 'rxjs';
import Chart from 'chart.js/auto';
import { IHistoricalData, IInstance } from '../../../../root/interfaces/instance';

@Component({
    selector: 'chart-cpu-line',
    template: ' <canvas id="myChartCPU"></canvas> ',
})
export class ChartCpuLineComponent implements OnDestroy, OnInit {
    @Input() instance$: Observable<IInstance>;
    data: any;
    options: any;
    themeSubscription: any;
    private cpuChart: Chart;

    constructor(private theme: NbThemeService) {}

    ngOnInit(): void {
        this.createCharts();
        this.instance$.subscribe((instance: IInstance) => {
            this.updateCharts(instance);
        });
    }

    createCharts() {
        this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
            const colors: any = config.variables;
            const chartjs: any = config.variables.chartjs;

            this.data = {
                labels: ['as', '23', 'as'],
                datasets: [
                    {
                        data: [3, 3, 2],
                        label: 'CPU usage',
                        backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                        borderColor: colors.primary,
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

            this.cpuChart = new Chart('myChartCPU', {
                type: 'line',
                data: this.data,
                options: this.options,
            });
        });
    }

    private updateCharts(instance: IInstance): void {
        let timeLables = instance.cpu_history.map((data: IHistoricalData) => {
            const d = new Date(data.timestamp);
            return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d
                .getSeconds()
                .toString()
                .padStart(2, '0')}`;
        });

        if (timeLables.length === 100) {
            const reducedList: any[] = [];
            for (let i = 0; i < 10; i++) {
                reducedList.push(timeLables[i * 10]);
            }
            timeLables = reducedList;
        } else {
            const index = timeLables.length - 1;
            timeLables = timeLables.slice(index - 10, index);
        }

        const cpuData = instance.cpu_history.map((data) => Number.parseFloat(data.value));
        this.cpuChart.data.datasets.forEach((dataset) => {
            dataset.data = cpuData;
        });
        this.cpuChart.data.labels = timeLables;
        this.cpuChart.update();
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }
}
