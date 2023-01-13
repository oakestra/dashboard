import { Injectable } from '@angular/core';
import { IService } from '../../../root/interfaces/service';

@Injectable({
    providedIn: 'root',
})
export class ServiceGeneratorService {
    // TODO Add the service data in the correct way
    public generateService(
        serviceInfo: any,
        requirements: any,
        fileSelect: any,
        addresses: any,
        argumentsArray: any,
        constraints: any,
        connectivity: any,
    ): IService {
        const service: IService = {
            ...serviceInfo,
            ...requirements,
            ...fileSelect,
            ...addresses,
            ...argumentsArray,
            ...constraints,
            ...connectivity,
        };
        return service;
    }
}
