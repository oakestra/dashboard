import {Component, OnInit} from '@angular/core';
import {SharedIDService} from "../../shared/modules/helper/shared-id.service";
import {ApiService} from "../../shared/modules/api/api.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'dev-home',
  templateUrl: './dev-home.component.html',
  styleUrls: ['./dev-home.component.css']
})
export class DevHomeComponent implements OnInit {

  jobs$: any;
  subscription: Subscription | undefined
  data: any
  appName: string = ""
  appID: string = ""

  constructor(public sharedService: SharedIDService,
              private api: ApiService) {
  }

  ngOnInit(): void {
    console.log("In dev init")
    this.subscription = this.sharedService.applicationObservable$.subscribe(
      x => {
          this.data = x
          this.appName = x.name
          this.appID = x._id.$oid
          this.loadData()
      });
  }

  loadData(): void {
    console.log("in dev loadData")
    this.api.getJobsOfApplication(this.appID).subscribe((jobs: any) => {
      this.jobs$ = jobs
    }, (err) => {
      console.log(err)
    })
  }

  deleteJob(job: any) {
    // TODO send delete also to the System manager
    // Delete in local Database
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
}
