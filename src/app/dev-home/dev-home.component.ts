import {Component, OnInit} from '@angular/core';
import {SharedIDService} from "../services/shared-id.service";
import {DbClientService} from "../services/db-client.service";
import {DataService} from "../services/data.service";

@Component({
  selector: 'dev-home',
  templateUrl: './dev-home.component.html',
  styleUrls: ['./dev-home.component.css']
})
export class DevHomeComponent implements OnInit {

  jobs$: any;

  constructor(private service: DataService,
              public sharedService: SharedIDService,
              private dbService: DbClientService) {
  }

  // Get alL Jobs in the Root
  ngOnInit(): void {
    this.jobs$ = this.dbService.jobs$
  }

  deleteJob(job: any) {
    // TODO check if job is really deleted in the API
    this.service.delete(job); // Delete in API
    this.dbService.deleteJob(job); // Delete in local Database
    this.jobs$ = this.dbService.jobs$;
  }

  deleteJobWithGraph(id: string) {
    let _id = {
      $oid: id
    }
    // TODO Check how the API  wants the id
    this.service.delete(id); // Delete in API
    this.dbService.deleteJob({_id}); // Delete in local Database
    this.jobs$ = this.dbService.jobs$;
  }

  sendSLAToAPI() {
    console.log("send");
    console.log(this.sharedService.sharedNode);
    console.log(this.sharedService.sharedNode.name);
  }

}
