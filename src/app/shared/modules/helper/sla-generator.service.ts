import { Injectable } from '@angular/core';
import { CleanJsonService } from '../../util/clean-json.service';
import { IService } from '../../../root/interfaces/service';
import { IApplication } from '../../../root/interfaces/application';
import { IUser } from '../../../root/interfaces/user';
import { UserService } from '../auth/user.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../../root/interfaces/notification';

@Injectable({
    providedIn: 'root',
})
export class SlaGeneratorService {
    constructor(
        private userService: UserService,
        private notifyService: NotificationService
    ) {
        userService.getOrganization();
    }

    public generateSLA(s: IService, app: IApplication, user: IUser) {
        const org = this.userService.getOrganization();
        const customer = org === 'root' ? user._id : org;
        const service = s === undefined ? [] : [s];
        const sla = {
            sla_version: 'v2.0',
            customerID: customer,
            applications: [
                {
                    applicationID: app._id,
                    application_name: app.application_name,
                    application_namespace: app.application_namespace,
                    application_desc: app.application_desc,
                    microservices: service,
                },
            ],
            args: [''],
        };
        return CleanJsonService.deleteEmptyValues(sla);
    }

    public validateAndGenerateFromFile(
        result: any,
        currentApplication: IApplication,
        currentUser: IUser
    ) {
        if (result.type === 'v2') {
            return this.generateSLAv2(result.data, currentApplication, currentUser);
        } else if (result.type === 'v1_microservices') {
            if (!currentApplication) {
                this.notifyService.notify(
                    NotificationType.error,
                    'No application selected. Cannot generate SLA from legacy format.'
                );
                return null;
            }
            if (!currentUser) {
                this.notifyService.notify(
                    NotificationType.error,
                    'User session not loaded. Please try again.'
                );
                return null;
            }
            const microservices = result.data as IService[];
            return microservices.map((service) =>
                this.generateSLA(service, currentApplication, currentUser)
            );
        }
        return null;
    }

    private generateSLAv2(
        data: any,
        currentApplication: IApplication,
        currentUser: IUser
    ) {
        const org = this.userService.getOrganization();
        const customer = org === 'root' ? currentUser._id.$oid : org;

        if (!data.customerID) {
            data.customerID = customer;
        } else if (data.customerID !== customer) {
            this.notifyService.notify(
                NotificationType.error,
                `SLA Error: File customerID "${data.customerID}" does not match current user "${customer}".`
            );
            return null;
        }

        if (data.applications && data.applications.length > 0) {
            const app = data.applications[0];
            if (!app.applicationID) {
                app.applicationID = currentApplication._id.$oid;
            } else if (app.applicationID !== currentApplication._id.$oid) {
                this.notifyService.notify(
                    NotificationType.error,
                    `SLA Error: File applicationID "${app.applicationID}" does not match current application "${currentApplication._id.$oid}".`
                );
                return null;
            }
        }
        return data;
    }
}
