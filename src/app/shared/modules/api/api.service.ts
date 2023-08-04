import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RestService } from '../../util/rest.service';
import { UserService } from '../auth/user.service';
import { NotificationService } from '../notification/notification.service';
import { environment } from '../../../../environments/environment';
import { WINDOW } from '../helper/window.providers';
import { IUser } from '../../../root/interfaces/user';
import { IApplication } from '../../../root/interfaces/application';
import { IService } from '../../../root/interfaces/service';
import { ICluster } from '../../../root/interfaces/cluster';
import { IOrganization } from '../../../root/interfaces/organization';
import { Role } from '../../../root/enums/roles';
import { SlaGeneratorService } from '../helper/sla-generator.service';
import { ISettings } from '../../../root/interfaces/settings';

@Injectable({
    providedIn: 'root',
})
export class ApiService extends RestService {
    apiUrl = environment.apiUrl;

    constructor(
        http: HttpClient,
        userService: UserService,
        notificationService: NotificationService,
        private slaGenerator: SlaGeneratorService,
        @Inject(WINDOW) window: Window,
    ) {
        super(http, userService, notificationService, window);
    }

    // /////////////////////////////////////////////////////////////////////////
    // /////////////////// Application Functions ///////////////////////////////

    addApplication(app: IApplication) {
        const sla = this.slaGenerator.generateSLA(undefined, app, this.userService.getUser());
        return this.doPOSTRequest('/application/', sla);
    }

    updateApplication(app: IApplication) {
        return this.doPUTRequest('/application/' + app._id.$oid, app);
    }

    deleteApplication(app: IApplication) {
        return this.doDELRequest('/application/' + app._id.$oid);
    }

    getApplicationsOfUser(userId: string): Observable<IApplication[]> {
        return this.doGETRequest('/applications/' + userId);
    }

    // /////////////////////////////////////////////////////////////////////////
    // /////////////////// Cluster Functions ///////////////////////////////

    getActiveClusters(): Observable<ICluster[]>  {
        return this.doGETRequest('/clusters/active');
    }

    getClusters(): Observable<ICluster[]> {
        return this.doGETRequest('/clusters/');
    }

    // /////////////////////////////////////////////////////////////////////////
    // /////////////////// Service Functions ///////////////////////////////////

    addService(service: IService): Observable<any> {
        return this.doPOSTRequest('/service/', service);
    }

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

    public registerUser(user: IUser): Observable<IUser> {
        return this.doPOSTRequest('/auth/register', user);
    }

    public updateUser(user: IUser): Observable<IUser> {
        return this.doPUTRequest('/user/' + user.name, user);
    }

    public deleteUser(user: IUser) {
        return this.doDELRequest('/user/' + user.name);
    }

    public getUserByName(username: string): Observable<IUser> {
        return this.doGETRequest('/user/' + username);
    }

    public getAllUser(organization_id: string): Observable<IUser[]> {
        if (organization_id !== '') {
            return this.doGETRequest(`/users/${organization_id}`);
        } else {
            return this.doGETRequest('/users/');
        }
    }

    changePassword(username: string, oldPassword: string, newPassword: string) {
        return this.doPOSTRequest('/user/' + username, {
            oldPassword,
            newPassword,
        });
    }

    // //////////////////////////////////////////////////////////////////////////
    // /////////////////// Organization Functions ///////////////////////////////

    addOrganization(org: IOrganization): Observable<string> {
        return this.doPOSTRequest('/organization/', org);
    }

    updateOrganization(app: IOrganization) {
        return this.doPUTRequest('/organization/' + app._id.$oid, app);
    }

    deleteOrganization(app: IOrganization) {
        return this.doDELRequest('/organization/' + app._id.$oid);
    }

    getOrganization(): Observable<IOrganization[]> {
        this.doGETRequest('/organization/').subscribe((x) => console.log(x));
        return this.doGETRequest('/organization/');
    }

    // /////////////////////////////////////////////////////////////////////////
    // /////////////////// Settings Functions //////////////////////////////////

    public setSettings(settings: ISettings) {
        return this.doPUTRequest('settings', settings);
    }

    public getSettings(): Observable<ISettings> {
        return this.doGETRequest('/settings');
    }

    // /////////////////////////////////////////////////////////////////////////
    // ////////////////// Functions  for Authorization /////////////////////////

    public getAuthorization(username: string): Observable<{ roles: Role[] }> {
        return this.doGETRequest('/permission/' + username).pipe(
            map((authJSON: any) => {
                const roles = Array<Role>();
                for (const r of authJSON.roles) {
                    roles.push(r);
                }
                return { roles };
            }),
        );
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
