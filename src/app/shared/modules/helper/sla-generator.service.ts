import { Injectable } from '@angular/core';
import { CleanJsonService } from '../../util/clean-json.service';
import { IService } from '../../../root/interfaces/service';
import { IApplication } from '../../../root/interfaces/application';
import { IUser } from '../../../root/interfaces/user';
import { UserService } from '../auth/user.service';

@Injectable({
    providedIn: 'root',
})
export class SlaGeneratorService {
    constructor(private userService: UserService) {
        userService.getOrganization();
    }

    public generateSLA(service: IService, app: IApplication, user: IUser) {
        const org = this.userService.getOrganization();
        const customer = org === 'root' ? user._id.$oid : org;
        const sla = {
            sla_version: 'v2.0',
            customerID: customer,
            applications: [
                {
                    applicationID: app._id.$oid,
                    application_name: app.application_name,
                    application_namespace: app.application_namespace,
                    application_desc: app.application_desc,
                    microservices: [service],
                },
            ],
            args: [''],
        };
        return CleanJsonService.deleteEmptyValues(sla);
    }
}
