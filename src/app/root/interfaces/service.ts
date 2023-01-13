import { Virtualization } from '../enums/virtualization';
import { IId } from './id';

export interface IService {
    _id?: IId;
    microserviceID?: string;
    microservice_name?: string;
    microservice_namespace?: string;
    virtualization?: Virtualization;
    description?: string;
    cmd?: string[];
    memory?: number;
    vcpus?: number;
    vgpus?: number;
    vtpus?: number;
    bandwidth_in?: number;
    bandwidth_out?: number;
    storage?: number;
    code?: string;
    state?: string;
    port?: string;
    addresses?: IAdresses;
    added_files?: string[];
    constraints?: [];
    instance_list?: any[]; // TODO Create instance interface
    status?: string;
    connectivity?: IConnectivity[];
}

export interface IAdresses {
    rr_ip?: string;
    closest_ip?: string[];
    instances?: {
        from?: string;
        start?: string;
        end?: string;
    };
}

export interface IConnectivity {
    target_microservice_id: string;
    con_constraints: ICon_constraints[];
}

export interface ICon_constraints {
    type: string;
    threshold: 0;
    rigidness: 0;
    convergence_time: 0;
}

export interface IConstraints {
    type: 'geo' | 'latency';
    area: string;
    cluster: string;
    node: string;
    location: string;
    threshold: 0;
    rigidness: 0;
    convergence_time: 0;
}
