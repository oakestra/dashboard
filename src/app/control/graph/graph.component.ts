import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {ApiService} from "../../shared/modules/api/api.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogGraphConnectionSettings} from "../dialogs/graph-content-connection/dialogGraphConnectionSettings";

declare function start(nodes: any, links: any): void;

declare function deleteLink(): void;

@Component({
  selector: 'graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnChanges {

  showConnections = false;
  nodes: any [] = [];
  links: any[] = [];

  @Output()
  updated = new EventEmitter<string>();

  @Input()
  jobs: any

  constructor(public dialog: MatDialog,
              public dbService: ApiService) {
  }

  ngOnChanges() {
    this.showConnections = false;
  }

  async openDialog(start: string, target: string) {
    let job: any = await this.getJob(start)
    let conn = this.findCorrectConstraint(target, job.job_sla.connectivity)
    console.log(job)
    console.log(conn)

    let data = {
      'start_serviceID': start,
      'targe_serviceID': target,
      'type': "geo",
      'threshold': 0,
      'rigidness': 0.1,
      'convergence_time': 300,
    }
    if (conn) {
      data = {
        'start_serviceID': start,
        'targe_serviceID': target,
        'type': conn.type,
        'threshold': conn.threshold,
        'rigidness': conn.rigidness,
        'convergence_time': conn.convergence_time,
      }
    }
    const dialogRef = this.dialog.open(DialogGraphConnectionSettings, {data});
    dialogRef.afterClosed().subscribe(result => this.saveGraphConstrains(result));
  }

  findCorrectConstraint(target: string, arr: any) {
    let conn = null
    for (let a of arr) {
      if (a.target_microservice_id == target) {
        conn = a.con_constraints;
      }
    }
    return conn
  }

  async saveGraphConstrains(data: any) {
    let jobProm: any = await this.getJob(data.start_serviceID)
    let newJob = jobProm.job_sla
    let index = newJob.connectivity.findIndex((d: any) => d.target_microservice_id == data.targe_serviceID)
    console.log(index)
    if (index < 0) {
      newJob.connectivity.push({
        target_microservice_id: data.targe_serviceID,
        con_constraints: {
          'type': data.type,
          'threshold': data.threshold,
          'rigidness': data.rigidness,
          'convergence_time': data.convergence_time
        }
      })
    } else {
      newJob.connectivity[index] = {
        target_microservice_id: data.targe_serviceID,
        con_constraints: {
          'type': data.type,
          'threshold': data.threshold,
          'rigidness': data.rigidness,
          'convergence_time': data.convergence_time,
        }
      };
    }

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
    // let newJob = {
    //   _id: {$oid: id},
    //   job_sla: job
    // }
    this.dbService.updateJob(job);
  }

  //TODO change id to number and inNumber to id also in js file
  getNodes() {
    this.nodes = []
    for (let job of this.jobs) {
      this.nodes.push({
        id: job.microservice_name,
        idNumber: job._id.$oid
      });
    }
    this.calculateLinks();
  }

  calculateLinks() {
    for (let job of this.jobs) {
      if (job.connectivity != undefined) {
        for (let targetJob of job.connectivity) {
          this.links.push({
            source: job._id.$oid,
            target: targetJob.target_microservice_id
          })
        }
      }
    }
  }

  toggleConnection() {
    this.showConnections = !this.showConnections;
  }

  get showConButton() {
    return this.showConnections ? "Hide Connection Graph" : "Show Connection Graph";
  }

  multipleFunctions() {
    this.toggleConnection();
    this.getNodes();
    this.start();
  }

  delete(id: any) {
    this.updated.emit(id);
    this.deleteOnlyLink()
  }

  deleteOnlyLink() {
    deleteLink(); // Call function in graph.js
  }

  print(start: string, target: string) {
    console.log("Test if function is executed")
    console.log(start)
    console.log(target)
  }

  start() {

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

