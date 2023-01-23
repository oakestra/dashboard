import { Injectable } from '@angular/core';
import { IService } from '../../../root/interfaces/service';

@Injectable({
    providedIn: 'root',
})
export class ServiceGeneratorService {
    public generateService(
        serviceInfo: any,
        requirements: any,
        fileSelect: any,
        addresses: any,
        argumentsArray: any,
        constraints: any,
        connectivity: any,
    ): IService {
        return {
            ...serviceInfo,
            ...requirements,
            ...fileSelect,
            ...addresses,
            ...argumentsArray,
            ...constraints,
            ...connectivity,
        };
    }
}
