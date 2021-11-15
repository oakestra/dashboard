import {Component, OnInit} from '@angular/core';
import {JobService} from "../services/job.service";
import {Job} from "../objects/job";
import {SharedIDService} from "../services/shared-id.service";

declare function start(nodes: any, links: any): void;

@Component({
  selector: 'dev-home',
  templateUrl: './dev-home.component.html',
  styleUrls: ['./dev-home.component.css']
})
export class DevHomeComponent implements OnInit {

  //activeApp: Application;
  jobs: Job[] | undefined;

  //private _showConButton = "Show Connection Graph";
  private firstCall = true;

  constructor(private service: JobService, public sharedService: SharedIDService) {}

  // Get alL Jobs in this Application
  ngOnInit(): void {

    this.service.getAll().subscribe(data => {
      this.jobs = data as Job[];
    });
  }

  startGraph() {
    this.firstCall = false;
    console.log("start");

    let nodes = [
      {id: "Hello this is my long name"},
      {id: "Y"},
      {id: "Z"},
      {id: "A"}
    ];

    let links = [
      {source: nodes[0], target: nodes[1]},
      {source: nodes[0], target: nodes[3]},
    ];
    start(nodes, links);
  }
}
