import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {shareReplay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class DbClientService {


  // apiUrl: string = "http://127.0.0.1:9999/frontend";
  apiUrl: string = "http://127.0.0.1:10011/frontend";
  _applications$: any;
  _jobs$: any;

  constructor(private http: HttpClient) {
    this._applications$ = this.http.get(this.apiUrl + "/apps/get");
    this._jobs$ = this.http.get(this.apiUrl + "/jobs/get");
  }

  get applications$() {
    return this._applications$;
  }

  addApplication(app: any) {
    this._applications$ = this.http.post(this.apiUrl + "/app/push", app)
  }

  updateApplication(app: any) {
    this._applications$ = this.http.post(this.apiUrl + "/app/update", app)
  }

  deleteApplication(app: any) {
    this._applications$ = this.http.post(this.apiUrl + "/app/delete", app)
  }

  getAppById(id: any) {
    return this.http.post(this.apiUrl + "/app/get", {_id: id})
  }

  get jobs$() {
    return this._jobs$;
  }

  get allJobs() {
    return this.http.get(this.apiUrl + "/jobs/get");
  }

  getJobsOfApplication(appId: string) {
    return this.http.get(this.apiUrl + "/jobs/get/" + appId);
  }

  //TODO Add description also to the DB but not to the sla
  addJob(job: any) {
    this._jobs$ = this.http.post(this.apiUrl + "/job/push", job).pipe(shareReplay(1))
    console.log("Added job to mongo")
  }

  updateJob(id: string, job: any) {
    console.log(job)
    console.log(id)
    this._jobs$ = this.http.post(this.apiUrl + "/job/update", {_id: {$oid: id}, job_sla: job})
    console.log("Update")
  }

  deleteJob(job: any) {
    this._jobs$ = this.http.post(this.apiUrl + "/job/delete", job)
  }

  getJobByID(job: any) {
    return this.http.post(this.apiUrl + "/job/get", {_id: job})
  }

  fileUpload(data: any) {
    return this.http.post(this.apiUrl + "/uploader", data)
  }
}
