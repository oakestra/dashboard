import { Injectable } from '@angular/core';
import { CleanJsonService } from '../../util/clean-json.service';
import { IService } from '../../../root/interfaces/service';
import { IApplication } from '../../../root/interfaces/application';
import { IUser } from '../../../root/interfaces/user';

@Injectable({
    providedIn: 'root',
})
export class SlaGeneratorService {
    public generateSLA(service: IService, app: IApplication, user: IUser) {
        const sla = {
            sla_version: 'v2.0',
            customerID: 'Admin',
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
        return CleanJsonService.cleanData(sla);
    }
}
