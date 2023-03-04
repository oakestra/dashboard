import { IAddresses } from './service';

export interface IInstance {
    cpu: number;
    memory: number;
    cluster_location: string;
    disk: string;
    cluster_id: string;
    public_ip: string;
    status: string;
    instance_list: string[];
    addresses: IAddresses;
    status_detail: string;
}
