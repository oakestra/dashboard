import {Component, OnInit} from '@angular/core';
import {SharedIDService} from "../../shared/modules/helper/shared-id.service";
import {DbClientService} from "../../shared/modules/api/db-client.service";
import {DataService} from "../../shared/modules/api/data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'dev-home',
  templateUrl: './dev-home.component.html',
  styleUrls: ['./dev-home.component.css']
})
export class DevHomeComponent implements OnInit {

  jobs$: any;
  generateJson = false;
  subscription: Subscription | undefined
  data: any
  appName: string = ""
  jsonContent: any

  constructor(private service: DataService,
              public sharedService: SharedIDService,
              private dbService: DbClientService) {
  }

  // Get alL Jobs in the Root
  ngOnInit(): void {
    console.log("init")
    this.subscription = this.sharedService.applicationObservable$.subscribe(
      formData => {
        this.data = formData;
        console.log("in component brother, ");
        console.log(this.data);
        formData.subscribe((x: any) => {
          console.log(x)
          this.data = x
          this.appName = x.name
          this.jobs$ = this.dbService.getJobsOfApplication(x._id.$oid)
          console.log(this.appName)
        })
      });
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

  generateSLA() {

    this.jsonContent = {
      "api_version": "v0.3.0",
      "customerID": 10000000001,
      "applications": {/*
        "applicationID": this.sharedService.sharedNode._id.$oid,
        "application_name": this.sharedService.sharedNode.name,
        "application_desc": this.sharedService.sharedNode.description,*/
        "microservices": [{}]
      },
    }


    this.dbService.jobs$.subscribe((data: any) => {
      let arr = []
      for (let service of data) {
        service.job_sla.microserviceID = service._id.$oid
        arr.push(service.job_sla)
      }
      this.jsonContent.applications.microservices = arr
      this.jsonContent = this.cleanData(this.jsonContent)
    })
  }

  // deletes all null values form the JSON Object
  cleanData(o: any) {
    if (Object.prototype.toString.call(o) == "[object Array]") {
      for (let key = 0; key < o.length; key++) {
        this.cleanData(o[key]);
        if (Object.prototype.toString.call(o[key]) == "[object Object]") {
          if (Object.keys(o[key]).length === 0) {
            o.splice(key, 1);
            key--;
          }
        }
      }
    } else if (Object.prototype.toString.call(o) == "[object Object]") {
      for (let key in o) {
        let value = this.cleanData(o[key]);
        if (value === null) {
          delete o[key];
        }
        if (Object.prototype.toString.call(o[key]) == "[object Object]") {
          if (Object.keys(o[key]).length === 0) {
            delete o[key];
          }
        }
        if (Object.prototype.toString.call(o[key]) == "[object Array]") {
          if (o[key].length === 0) {
            delete o[key];
          }
        }
      }
    }
    return o;
  }

  sendSLAToAPI() {
    this.generateSLA()
    this.generateJson = true;
    console.log("send");
  }
}
