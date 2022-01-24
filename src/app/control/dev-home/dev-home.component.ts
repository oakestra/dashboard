import {Component, OnDestroy, OnInit} from '@angular/core';
import {SharedIDService} from "../../shared/modules/helper/shared-id.service";
import {ApiService} from "../../shared/modules/api/api.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogJobStatusView} from "../dialogs/jobs-status/dialogJobStatus";
import {Subscription} from "rxjs/internal/Subscription";

@Component({
  selector: 'dev-home',
  templateUrl: './dev-home.component.html',
  styleUrls: ['./dev-home.component.css']
})
export class DevHomeComponent implements OnInit, OnDestroy {

  jobs: any;
  jobsCount = 0;
  appName: string = ""
  appID: string = ""
  subscriptions: Subscription[] = []

  constructor(public sharedService: SharedIDService,
              private api: ApiService,
              public dialog: MatDialog){
  }

  ngOnInit(): void {
    let sub = this.sharedService.applicationObserver$.subscribe(
      x => {
        this.appName = x.name
        this.appID = x._id.$oid
        this.loadData()
      });
    this.subscriptions.push(sub)
  }

  ngOnDestroy() {
    for (let s of this.subscriptions) {
      s.unsubscribe()
    }
  }

  loadData(): void {
    let sub = this.api.getJobsOfApplication(this.appID).subscribe((jobs: any) => {
      this.jobs = jobs
      this.jobsCount = jobs.length
    }, (err) => {
      console.log(err)
    })
    this.subscriptions.push(sub)
  }

  deleteJob(job: any) {
    this.api.deleteJob(job).subscribe(() => {
      this.loadData()
    })
  }

  deployJob(job: any) {
    this.api.deployJob(job).subscribe(() => {
      this.loadData()
    })
  }

  deleteJobWithGraph(id: string) {
    let job = {_id: {$oid: id}}
    this.api.deleteJob(job).subscribe(() => {
      this.loadData()
    })
  }

  openStatusDialog(job: any) {
    const dialogRef = this.dialog.open(DialogJobStatusView, {data: job});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    });
  }

  deployAllJobs() {
    for (let j of this.jobs) {
      this.deployJob(j)
    }
  }
}
