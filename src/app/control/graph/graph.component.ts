import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DbClientService} from "../../shared/modules/api/db-client.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogGraphConnectionSettings} from "../dialogs/dialogGraphConnectionSettings";
import {SharedIDService} from "../../shared/modules/helper/shared-id.service";

declare function start(nodes: any, links: any): void;

declare function deleteLink(): void;

@Component({
  selector: 'graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {

  showConnections = false;
  private firstCall = true; // to prevent reloading every time

  nodes: any [] = [];
  links: any[] = [];

  @Output()
  updated = new EventEmitter<string>();


  constructor(private dbService: DbClientService,
              public dialog: MatDialog,
              private sharedService: SharedIDService) {

  }

  ngOnInit(): void {
    console.log("Jobs in Graph")
    console.log(this.sharedService.jobs)
    //this.getNodes();
  }

  openDialog(start: string, target: string) {
    let data = {
      'start_serviceID': start,
      'targe_serviceID': target,
      'type': "",
      'threshold': 100,
      'rigidness': 0.1,
      'convergence_time': 300,
    }

    const dialogRef = this.dialog.open(DialogGraphConnectionSettings, {data});

    dialogRef.afterClosed().subscribe(result => this.saveGraphConstrains(result));
  }

  // TODO fix this, the db should be updated correct
  async saveGraphConstrains(data: any) {
    let newJob
    let jobProm: any = await this.getJob(data.start_serviceID)
    newJob = jobProm.job_sla
    let index = newJob.connectivity.findIndex((d: any) => d.target_microservice_id == data.targe_serviceID)
    newJob.connectivity[index] = {
      target_microservice_id: data.targe_serviceID,
      con_constraints: {
        'type': data.type,
        'threshold': data.threshold,
        'rigidness': data.rigidness,
        'convergence_time': data.convergence_time,
      }
    };
    this.update(data.start_serviceID, newJob)
  }

  async getJob(id: string) {
    return new Promise((job) => {
      this.dbService.getJobByID(id).subscribe(x => {
        job(x)
      })
    })
  }

  update(id: string, job: any) {
    this.dbService.updateJob(id, job)
  }

  //TODO change id to number and inNumber to id also in js file
  getNodes() {
    console.log(this.sharedService.jobs)
    //this.sharedService.
    //1this.dbService.getJobsOfApplication()
    // this.dbService.jobs$.subscribe((data: any[]) => {
    this.sharedService.jobs.subscribe((data: any[]) => {
      for (let job of data) {
        this.nodes.push({
          id: job.job_sla.microservice_name,
          idNumber: job._id.$oid
        });
      }
    });
    this.calculateLinks();
  }

  calculateLinks() {
    this.dbService.jobs$.subscribe((data: any[]) => {
      for (let job of data) {
        if (job.job_sla.connectivity != undefined) {
          for (let targetJob of job.job_sla.connectivity) {
            this.links.push({
              source: job._id.$oid,
              target: targetJob.target_microservice_id
            })
          }
        }
      }
    });
  }

  toggleConnection() {
    this.showConnections = !this.showConnections;
  }

  get showConButton() {
    return this.showConnections ? "Hide Connection Graph" : "Show Connection Graph";
  }

  multipleFunctions() {
    this.toggleConnection();
    // if (this.firstCall) this.start();
    this.start();
  }

  delete(id: any) {
    this.updated.emit(id);
    this.deleteOnlyLink()
    this.ngOnInit()
  }

  deleteOnlyLink() {
    deleteLink(); // Call function in graph.js
  }

  start() {

    this.getNodes();

    this.firstCall = false; // Wozu wird das gebraucht?
    let linksNew = [];
    let l = this.links;
    let n = this.nodes;

    // TODO make this without 3 loops
    for (let x = 0; x < l.length; x++) {
      for (let i = 0; i < n.length; i++) {
        for (let j = 0; j < n.length; j++) {
          if (l[x].source == n[i].idNumber && l[x].target == n[j].idNumber) {
            linksNew.push({source: n[i], target: n[j]})
          }
        }
      }
    }
    start(this.nodes, linksNew);
  }
}

