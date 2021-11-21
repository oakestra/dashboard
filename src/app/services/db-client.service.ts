import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {shareReplay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class DbClientService {

  mongoUrl: string = "http://127.0.0.1:10011/frontend";
  _applications$: any;
  _jobs$: any;

  constructor(private http: HttpClient) {
    this._applications$ = this.http.get(this.mongoUrl + "/apps/get");
    this._jobs$ = this.http.get(this.mongoUrl + "/jobs/get");
  }

  get applications$() {
    return this._applications$;
  }

  addApplication(app: any) {
    this._applications$ = this.http.post(this.mongoUrl + "/app/push", app)
  }

  updateApplication(data: any) {
    this._applications$ = this.http.post(this.mongoUrl + "/app/update", data)
  }

  deleteApplication(app: any) {
    this._applications$ = this.http.post(this.mongoUrl + "/app/delete", app)
  }

  getAppById(id: any) {
    return this.http.post(this.mongoUrl + "/app/get", {_id: id})
  }

  get jobs$() {
    return this._jobs$;
  }

  get allJobs() {
    return this.http.get(this.mongoUrl + "/jobs/get");
  }

  //TODO Add description also to the DB but not to the sla
  addJob(job: any) {
    this._jobs$ = this.http.post(this.mongoUrl + "/job/push", job).pipe(shareReplay(1))
    console.log("Added job to mongo")
  }

  updateJob(id: string, job: any) {
    this._jobs$ = this.http.post(this.mongoUrl + "/job/update", {_id: {$oid: id}, job_sla: job}).subscribe(e => console.log(e))
    console.log("Update")
  }

  deleteJob(job: any) {
    this._jobs$ = this.http.post(this.mongoUrl + "/job/delete", job)
  }

  getJobByID(job: any) {
    return this.http.post(this.mongoUrl + "/job/get", {_id: job})
  }
}
