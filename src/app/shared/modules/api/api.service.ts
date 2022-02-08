import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {RestService} from "../../util/rest.service";
import {UserService} from "../auth/user.service";
import {NotificationService} from "../notification/notification.service";
import {environment} from "../../../../environments/environment";
import {WINDOW} from "../helper/window.providers";


@Injectable({
  providedIn: 'root'
})

export class ApiService extends RestService {

  apiUrl = environment.apiUrl

  constructor(http: HttpClient,
              userService: UserService,
              notificationService: NotificationService,
              @Inject(WINDOW) window: Window) {
    super(http, userService, notificationService,window)

  }

///////////////////////////////////////////////////////////////////////////
///////////////////// Application Functions ///////////////////////////////

  addApplication(app: any) {
    return this.doPOSTRequest("/application", app)
  }

  updateApplication(app: any) {
    return this.doPUTRequest("/application/" + app._id.$oid, app)
  }

  deleteApplication(app: any) {
    return this.doDELRequest("/application/" + app._id.$oid)
  }

  getAppById(appId: any) {
    return this.doGETRequest("/application/" + appId)
  }

  getApplicationsOfUser(userId: string) {
    return this.doGETRequest("/applications/" + userId)
  }

///////////////////////////////////////////////////////////////////////////
///////////////////// Job Functions ///////////////////////////////////////

  addJob(job: any) {
    return this.doPOSTRequest("/job", job)
  }

  updateJob(job: any) {
    return this.doPUTRequest("/job/" + job.microserviceID, job)
  }

  deleteJob(job: any) {
    return this.doDELRequest("/job/" + job._id.$oid)
  }

  getJobByID(jobID: any) {
    return this.doGETRequest("/job/" + jobID)
  }

  getJobsOfApplication(appId: string) {
    return this.doGETRequest("/jobs/" + appId)
  }

  deployJob(job: any) {
    return this.doGETRequest("/deploy/" + job._id.$oid)
  }

///////////////////////////////////////////////////////////////////////////
//////////////////// User Functions ///////////////////////////////////////

  public registerUser(user: UserEntity): Observable<any> {
    return this.doPOSTRequest("/auth/register", user)
  }

  public updateUser(user: UserEntity) {
    return this.doPUTRequest("/user/" + user.name, user)
  }

  public deleteUser(user: UserEntity) {
    return this.doDELRequest("/user/" + user.name)
  }

  public getUserByName(username: string) {
    return this.doGETRequest("/user/" + username)
  }

  public getAllUser() {
    return this.doGETRequest("/users")
  }

///////////////////////////////////////////////////////////////////////////
//////////////////// Functions  for Authorization /////////////////////////

  public getAuthorization(username: string): Observable<{ roles: UserRole[] }> {
    return this.doGETRequest("/permission/" + username).pipe(
      map((authJSON: any) => {
        const roles = Array<UserRole>();
        for (const r of authJSON["roles"]) {
          roles.push(r);
        }
        return {roles};
      })
    );
  }

  public getRoles(): Observable<any> {
    return this.http.get(this.apiUrl + "/roles").pipe(
      map((data: any) => {
        return {roles: data};
      })
    );
  }

///////////////////////////////////////////////////////////////////////////
///////////////////// Other Functions ///////////////////////////////////////

  fileUpload(data: any) {
    return this.http.post(this.apiUrl + "/uploader", data)
  }

  changePassword(username: any, oldPassword: string, newPassword: string) {
    return this.doPOSTRequest("/changePassword/" + username, {
      oldPassword,
      newPassword,
    });
  }

  resetPassword(username: string) {
    let obj = {
      'username' : username,
      'domain': window.location.host
    }
    return this.doPOSTPublicRequest("/auth/resetPassword", obj);
  }

  saveResetPassword(token: string, password: string) {
    return this.doPUTPublicRequest("/auth/resetPassword", {token, password});
  }
}

///////////////////////////////////////////////////////////////////////////
//////////////////////// Helpful Interfaces ///////////////////////////////

export interface UserEntity {
  _id: object
  name: string;
  password: string;
  email: string;
  created_at: string;
  roles: Array<UserRole>;
}

export interface LoginRequest {
  username: string,
  password: string
}

export class UserRole {
  name: string;
  description: string;

  constructor() {
    this.name = "";
    this.description = "";
  }
}
