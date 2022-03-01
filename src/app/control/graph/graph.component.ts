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
              public api: ApiService) {
  }

  ngOnChanges() {
    this.showConnections = false;
  }

  async openDialog(start: string, target: string, mode: string) {
    let job: any = await this.getJob(start)
    let conn = this.findCorrectConstraint(target, job.connectivity)

    let data = {
      'start_serviceID': start,
      'target_serviceID': target,
      'type': "geo",
      'threshold': 100,
      'rigidness': 10,
      'convergence_time': 300,
    }
    if (conn) {
      conn = conn[0]
      data = {
        'start_serviceID': start,
        'target_serviceID': target,
        'type': conn.type,
        'threshold': conn.threshold,
        'rigidness': conn.rigidness,
        'convergence_time': conn.convergence_time,
      }
    }
    const dialogRef = this.dialog.open(DialogGraphConnectionSettings, {data});
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Save') {
        this.saveGraphConstrains(result.data)
      } else if (result.event == 'Cancel' && mode == 'new') {
        deleteLink()
      } else if (result.event == 'Delete') {
        this.deleteOnlyLink(start, target)
      } else if (result.event == 'Switch') {
        this.openDialog(target, start, 'edit')
      }
    })
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
    let newJob = jobProm
    let index = newJob.connectivity.findIndex((d: any) => d.target_microservice_id == data.target_serviceID)
    if (index < 0) { // add new constrains
      newJob.connectivity.push({
        target_microservice_id: data.target_serviceID,
        con_constraints: [{
          'type': data.type,
          'threshold': data.threshold,
          'rigidness': data.rigidness,
          'convergence_time': data.convergence_time
        }]
      })
    } else { // edit existing constraint
      newJob.connectivity[index] = {
        target_microservice_id: data.target_serviceID,
        con_constraints: [{
          'type': data.type,
          'threshold': data.threshold,
          'rigidness': data.rigidness,
          'convergence_time': data.convergence_time,
        }]
      };
    }
    this.update(newJob)
  }

  async getJob(id: string) {
    return new Promise((job) => {
      this.api.getJobByID(id).subscribe(x => {
        job(x)
      })
    })
  }

  update(job: any) {
    this.api.updateJob(job).subscribe(() => console.log("Updated Constrains"));
  }

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
    deleteLink()
  }

  deleteOnlyLink(start: string, target: string) {
    this.api.getJobByID(start).subscribe((job: any) => {
      let index = job.connectivity.findIndex((d: any) => d.target_microservice_id == target)
      job.connectivity.splice(index, 1)
      this.update(job)
    })
    deleteLink(); // deletes Lin in the graph
  }

  start() {
    let linksNew = [];
    let l = this.links;
    let n = this.nodes;

    for (let x = 0; x < l.length; x++) {
      for (let i = 0; i < n.length; i++) {
        for (let j = 0; j < n.length; j++) {
          if (l[x].source == n[i].idNumber && l[x].target == n[j].idNumber) {

            // To combine two links between nodes to one, but then you have problems with if you
            // want to delete on connection.

            // let backwardsLink = {source: n[j], target: n[i], left: false, right: true}
            // let index: number = linksNew.findIndex(x => (x.source == n[j] && x.target == n[i]))
            // console.log("index")
            // console.log(index)
            // if (index >= 0) {
            //   linksNew[index] = ({source: n[i], target: n[j], left: true, right: true})
            // } else {
            linksNew.push({source: n[i], target: n[j], left: false, right: true})
            // }
          }
        }
      }
    }
    start(this.nodes, linksNew);
  }
}
