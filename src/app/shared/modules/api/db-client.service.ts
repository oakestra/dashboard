import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, shareReplay} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {UserEntity, UserRole} from "../../../landingpage/login/login.component";

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

  getApplicationsOfUser(userId: string) {
    return this.http.get(this.apiUrl + "/app/get/" + userId);
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
    this._jobs$ = this.http.post(this.apiUrl + "/job/push", job).subscribe(e => console.log(e))
    // this._jobs$ = this.http.post(this.apiUrl + "/job/push", job)//.pipe(shareReplay(1))
    console.log("Added job to mongo")
  }

  updateJob(id: string, job: any) {
    this._jobs$ = this.http.post(this.apiUrl + "/job/update", {
      _id: {$oid: id},
      job_sla: job
    }).subscribe(e => console.log(e))
  }

  deleteJob(job: any) {
    this._jobs$ = this.http.post(this.apiUrl + "/job/delete", job)
  }

  getJobByID(job: any) {
    return this.http.post(this.apiUrl + "/job/get", {_id: job})
  }

  // fileUpload(data: any) {
  //   return this.http.post(this.apiUrl + "/uploader", data)
  // }


  fileUpload(data: any) {
    this.http.post("http://127.0.0.1:10000/api/deploy", data).subscribe(x => console.log(x))
    //return this.http.post(this.apiUrl + "/uploader", data)
  }


  generateJsonOnServer(data: any) {
    console.log(data)

    const requestOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(this.apiUrl + "/file", data, requestOptions)
  }

  public registerUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl + "/auth/register", user);
  }

  public getUserID(username: string) {
    return this.http.get(this.apiUrl + "/userByName/" + username);
  }

  public getAllUser() {
    return this.http.get(this.apiUrl + "/user");
  }

  public deleteUser(user: UserEntity){
    return this.http.post(this.apiUrl + "/user/delete",user)
  }


  public getAuthorization(username: string, token: any): Observable<{ roles: UserRole[] }> {
    const requestOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }),
    };
    return this.http.get(this.apiUrl + "/userpermission/" + username, requestOptions).pipe(
      map((authJSON: any) => {
        console.log(authJSON)
        const roles = Array<UserRole>();
        for (const roleJSON of authJSON["roles"]) {
          //roles.push(UserRole.fromJSON(roleJSON));
        }
        return {roles};
      })
    );
  }

}
