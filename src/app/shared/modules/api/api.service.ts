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
    super(http, userService, notificationService, window)

  }

///////////////////////////////////////////////////////////////////////////
///////////////////// Application Functions ///////////////////////////////

  addApplication(app: any) {
      return this.doPOSTRequest("/application/", app)
  }

  updateApplication(app: any) {
    return this.doPUTRequest("/application/" + app.applicationID, app)
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

  // not used yet, use it later for the admin view
  public getAllApplication() {
    return this.doGETRequest("/applications/")
  }


///////////////////////////////////////////////////////////////////////////
///////////////////// Cluster Functions ///////////////////////////////

  addCluster(cluster: any) {
    return this.doPOSTRequest("/cluster/add", cluster)
  }

  updateCluster(cluster: any) {
    return this.doPUTRequest("/clusters/" + cluster.clusterID, cluster)
  }

  deleteCluster(cluster: any) {
    return this.doDELRequest("/clusters/" + cluster._id.$oid)
  }

  getClustersOfUser(userId: string) {
    return this.doGETRequest("/clusters/" + userId)
  }

///////////////////////////////////////////////////////////////////////////
///////////////////// Service Functions ///////////////////////////////////////

  addService(service: any) {
    return this.doPOSTRequest("/service/", service)
  }

  updateService(service: any, serviceID: string) {
    return this.doPUTRequest("/service/" + serviceID, service)
  }

  deleteService(service: any) {
    return this.doDELRequest("/service/" + service._id.$oid)
  }

  deleteInstance(service: any, instance: any) {
    return this.doDELRequest("/service/" + service._id.$oid + "/instance" + instance.instance_number)
  }

  getServiceByID(serviceID: any) {
    return this.doGETRequest("/service/" + serviceID)
  }

  getServicesOfApplication(appId: string) {
    return this.doGETRequest("/services/" + appId)
  }

  deployService(service: any) {
    return this.doPOSTRequest("/service/" + service._id.$oid + "/instance", service)
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
    return this.doGETRequest("/users/")
  }

  changePassword(username: any, oldPassword: string, newPassword: string) {
    return this.doPOSTRequest("/user/" + username, {
      oldPassword,
      newPassword,
    });
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

  public getRoles() {

    let roles = [{"name": "Admin", "description": "This is the admin role"},
      {"name": "Application_Provider", "description": "This is the app role"},
      {"name": "Infrastructure_Provider", "description": "This is the infra role"}]

    return roles
    // return this.http.get(this.apiUrl + "/roles").pipe(
    //   map((data: any) => {
    //     return {roles: data};
    //   })
    // );
  }

///////////////////////////////////////////////////////////////////////////
///////////////////// Other Functions ///////////////////////////////////////

  fileUpload(data: any) {
    return this.http.post(this.apiUrl + "/uploader", data)
  }

  resetPassword(username: string) {
    let obj = {
      'username': username,
      'domain': window.location.host
    }
    return this.doPOSTPublicRequest("/user/", obj);
  }

  saveResetPassword(token: string, password: string) {
    return this.doPUTPublicRequest("/user/", {token, password});
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
