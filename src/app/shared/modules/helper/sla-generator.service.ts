import { Injectable } from '@angular/core';
import { CleanJsonService } from '../../util/clean-json.service';
import { IService } from '../../../root/interfaces/service';

@Injectable({
    providedIn: 'root',
})
export class SlaGeneratorService {
    public generateSLA(service: IService) {
        const sla = {
            sla_version: 'v2.0',
            customerID: '',
            applications: [
                {
                    // TODO GET APP and user from store and set real values
                    applicationID: '',
                    application_name: '',
                    application_namespace: '',
                    application_desc: '',
                    microservices: [service],
                },
            ],
            args: [''],
        };

        return CleanJsonService.cleanData(sla);
    }
}
