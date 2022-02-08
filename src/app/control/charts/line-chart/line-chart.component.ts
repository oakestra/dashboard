import {Component, Input, OnInit} from '@angular/core';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Decimation,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";

declare function initMap(lng:number, lat:number): void;

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  // styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {

  @Input() usage: any;

  constructor() {
    Chart.register(LineElement, LineController, PointElement, BarElement, BarController, CategoryScale,
      Decimation, Filler, Legend, Title, Tooltip, LinearScale);
  }


  ngOnInit(): void {
    console.log(this.usage)
    new Chart("myChartCPU", {
      type: 'line',
      data: {
        labels: this.usage.cpuTime,
        datasets: [{
          label: 'usage [%]',
          data: this.usage.currentCPU,
          backgroundColor: 'rgb(56,203,24)',
          borderColor: 'rgb(56,203,24)',
          borderWidth: 1,
          fill: {
            target: 'origin',
            above: 'rgb(56,203,24, 0.5)',   // Area will be red above the origin
          }
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'CPU usage'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    new Chart("myChartMemory", {
      type: 'line',
      data: {
        labels: this.usage.memoryTime,
        datasets: [{
          label: 'Memory [bytes]',
          data: this.usage.currentMemory,
          backgroundColor: 'rgb(36,90,238)',
          borderColor: 'rgb(36,90,238)',
          borderWidth: 1,
          fill: {
            target: 'origin',
            above: 'rgb(36,90,238, 0.5)',   // Area will be red above the origin
          }
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Memory usage'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    initMap(this.usage.geoInformation.lng, this.usage.geoInformation.lat);
  }
}
