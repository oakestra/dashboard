import { IAddresses } from './service';

export interface IInstance {
    cpu: number;
    cpu_history: IHistoricalData[];
    memory: number;
    memory_history: IHistoricalData[];
    cluster_location: string;
    disk: string;
    cluster_id: string;
    publicip: string;
    status: string;
    instance_list: string[];
    addresses: IAddresses;
    status_detail: string;
    instance_number: number;
}

export interface IHistoricalData {
    value: string;
    timestamp: { $date: Date };
}
