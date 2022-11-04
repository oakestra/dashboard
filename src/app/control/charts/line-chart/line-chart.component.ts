import {Component, Input, OnInit} from '@angular/core';
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
  Tooltip
} from "chart.js";

declare function initMap(lng: number, lat: number, radius: number): void;

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
})
export class LineChartComponent implements OnInit {

  @Input() instance_list: any;

  constructor() {
    Chart.register(LineElement, LineController, PointElement, BarElement, BarController, CategoryScale,
      Decimation, Filler, Legend, Title, Tooltip, LinearScale, DoughnutController, ArcElement);
  }


  ngOnInit(): void {

    // Doughnut chart with only current value.
    new Chart("myChartCPU", {
      type: 'doughnut',
      data: {
        labels: [
          'used',
          'free',
        ],
        datasets: [{
          label: 'usage [%]',
          data: [this.instance_list.cpu, 100 - this.instance_list.cpu],
          backgroundColor: [
            'rgb(235,54,75, 0.8)',
            'rgba(90,246,93,0.8)',
          ],
          hoverOffset: 4
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'CPU usage'
          }
        }
      }
    });

    // # Line chart with data history. Needs an array of historic data
    // new Chart("myChartCPU", {
    //   type: 'line',
    //   data: {
    //     labels: this.instance_list.cpu,
    //     datasets: [{
    //       label: 'usage [%]',
    //       data: this.instance_list.cpu,
    //       backgroundColor: 'rgb(56,203,24)',
    //       borderColor: 'rgb(56,203,24)',
    //       borderWidth: 1,
    //       fill: {
    //         target: 'origin',
    //         above: 'rgb(56,203,24, 0.5)',   // Area will be red above the origin
    //       }
    //     }]
    //   },
    //   options: {
    //     plugins: {
    //       title: {
    //         display: true,
    //         text: 'CPU usage'
    //       }
    //     },
    //     scales: {
    //       y: {
    //         beginAtZero: true
    //       }
    //     }
    //   }
    // });

    // TODO Add historic data
    new Chart("myChartMemory", {
      type: 'line',
      data: {
        labels: [0, 1], // Could be a time stamp
        datasets: [{
          label: 'Memory [bytes]',
          data: [this.instance_list.memory, this.instance_list.memory],
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
      }
    });
    // TODO Update map with real values and display only a polygon
    var location_split = this.instance_list.cluster_location.split(",",3)
    if (typeof location_split !== 'undefined' && location_split.length == 3) {
      initMap(+location_split[1],+location_split[0],+location_split[2]);
    }else{
      initMap(0.0,0.0,19999999);
    }
  }
}
