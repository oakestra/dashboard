import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";

declare function start(nodes: any, links: any): void;
declare function deleteLink(): void;

@Component({
  selector: 'app-test-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {

  showConnections = false;
  private firstCall = true;

  constructor() {}

  ngOnInit(): void {}

  toggleConncetion() {
    this.showConnections = !this.showConnections;
  }

  get showConButton() {
    return this.showConnections ? "Hide Connection Graph" : "Show Connection Graph";
  }

  multipleFunctions(){
    this.toggleConncetion();
    if(this.firstCall) this.start();
  }

  delete(){
    deleteLink();
  }

  start() {
    this.firstCall = false;

    let nodes = [
      {id: "Hello this is my long name"},
      {id: "1"},
      {id: "2"},
      {id: "3"},
      {id: "4"},
      {id: "5"},
      {id: "6"},
      {id: "7"},
      {id: "8"},
      {id: "9"}
    ];

    let links = [
      {source: nodes[0], target: nodes[1]},
      {source: nodes[0], target: nodes[3]},
    ];

    start(nodes, links);
  }
}

