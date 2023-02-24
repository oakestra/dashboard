import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RestService } from '../../util/rest.service';
import { UserService } from '../auth/user.service';
import { NotificationService } from '../notification/notification.service';
import { environment } from '../../../../environments/environment';
import { WINDOW } from '../helper/window.providers';
import { IUser, IUserRole } from '../../../root/interfaces/user';
import { IApplication } from '../../../root/interfaces/application';
import { IService } from '../../../root/interfaces/service';
import { ICluster } from '../../../root/interfaces/cluster';

@Injectable({
    providedIn: 'root',
})
export class ApiService extends RestService {
    apiUrl = environment.apiUrl;

    constructor(
        http: HttpClient,
        userService: UserService,
        notificationService: NotificationService,
        @Inject(WINDOW) window: Window,
    ) {
        super(http, userService, notificationService, window);
    }

    // /////////////////////////////////////////////////////////////////////////
    // /////////////////// Application Functions ///////////////////////////////

    addApplication(app: IApplication) {
        // TODO do this in the sla generation service
        const test: any = [];
        const sla = {
            sla_version: 'v2.0',
            customerID: 'Admin',
            applications: [
                {
                    applicationID: app._id,
                    application_name: app.application_name,
                    application_namespace: app.application_namespace,
                    application_desc: app.application_desc,
                    microservices: test,
                },
            ],
            args: ['string'],
        };

        return this.doPOSTRequest('/application/', sla);
    }

    updateApplication(app: IApplication) {
        return this.doPUTRequest('/application/' + app._id.$oid, app);
    }

    updateApplicationWithService(sla: any) {
        console.log(sla);
        const app = sla.applications[0];
        console.log(app);
        // return this.doPOSTRequest('/application/', app);
        return this.doPOSTRequest('/service/', sla);
        // return this.doPOSTRequest('/application/' + app.applicationID, app);
    }

    deleteApplication(app: IApplication) {
        return this.doDELRequest('/application/' + app._id.$oid);
    }

    // TODO find a away to delete this
    getAppById(appId: string): Observable<IApplication> {
        return this.doGETRequest('/application/' + appId);
    }

    getApplicationsOfUser(userId: string): Observable<IApplication[]> {
        return this.doGETRequest('/applications/' + userId);
    }

    // /////////////////////////////////////////////////////////////////////////
    // /////////////////// Cluster Functions ///////////////////////////////

    /* TODO Decide how to use the cluster and if we need them implement the functionality
        and use the store for the cluster data
     */

    deleteCluster(clusterId: string) {
        return this.doDELRequest('/cluster/' + clusterId);
    }

    getClustersOfUser(userId: string | null): Observable<ICluster[]> {
        return this.doGETRequest('/clusters/' + userId);
    }

    getClusterById(clusterId: string) {
        return this.doGETRequest('/cluster/' + clusterId);
    }

    // /////////////////////////////////////////////////////////////////////////
    // /////////////////// Service Functions ///////////////////////////////////

    addService(service: IService): Observable<string> {
        return this.doPOSTRequest('/service/', service);
    }

    // sla and not service is here the argument? //TODO Why 2 parameters and not one
    updateService(service: any, serviceID: string): Observable<IService> {
        return this.doPUTRequest('/service/' + serviceID, service);
    }

    deleteService(service: IService) {
        return this.doDELRequest('/service/' + service._id?.$oid);
    }

    getServiceByID(serviceID: string): Observable<IService> {
        return this.doGETRequest('/service/' + serviceID);
    }

    getServicesOfApplication(appId: string): Observable<IService[]> {
        return this.doGETRequest('/services/' + appId);
    }

    deployService(service: IService) {
        return this.doPOSTRequest('/service/' + service._id?.$oid + '/instance', service);
    }

    deleteInstance(service: IService, instance: any) {
        return this.doDELRequest('/service/' + service._id?.$oid + '/instance/' + instance.instance_number);
    }

    // /////////////////////////////////////////////////////////////////////////
    // ////////////////// User Functions ///////////////////////////////////////

    public registerUser(user: IUser): Observable<any> {
        return this.doPOSTRequest('/auth/register', user);
    }

    public updateUser(user: IUser) {
        return this.doPUTRequest('/user/' + user.name, user);
    }

    public deleteUser(user: IUser) {
        return this.doDELRequest('/user/' + user.name);
    }

    public getUserByName(username: string): Observable<IUser> {
        return this.doGETRequest('/user/' + username);
    }

    public getAllUser(): Observable<IUser[]> {
        return this.doGETRequest('/users/');
    }

    changePassword(username: string, oldPassword: string, newPassword: string) {
        return this.doPOSTRequest('/user/' + username, {
            oldPassword,
            newPassword,
        });
    }

    // /////////////////////////////////////////////////////////////////////////
    // ////////////////// Functions  for Authorization /////////////////////////

    public getAuthorization(username: string): Observable<{ roles: IUserRole[] }> {
        return this.doGETRequest('/permission/' + username).pipe(
            map((authJSON: any) => {
                const roles = Array<IUserRole>();
                for (const r of authJSON.roles) {
                    roles.push(r);
                }
                return { roles };
            }),
        );
    }

    public getRoles() {
        const roles: IUserRole[] = [
            { name: 'Admin', description: 'This is the admin role' },
            { name: 'Application_Provider', description: 'This is the app role' },
            { name: 'Infrastructure_Provider', description: 'This is the infra role' },
        ];

        return roles;
    }

    // /////////////////////////////////////////////////////////////////////////
    // /////////////////// Other Functions ///////////////////////////////////////

    fileUpload(data: any) {
        return this.http.post(this.apiUrl + '/uploader', data);
    }

    resetPassword(username: string) {
        const obj = {
            username,
            domain: window.location.host,
        };
        return this.doPOSTPublicRequest('/user/', obj);
    }

    saveResetPassword(token: string, password: string) {
        return this.doPUTPublicRequest('/user/', { token, password });
    }
}
