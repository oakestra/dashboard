import { IId } from './id';

export interface ICluster {
    _id: IId;
    active: boolean;
    active_nodes: number;
    aggregated_cpu_percent: number;
    memory_in_mb: number;
    total_cpu_cores: number;
    total_gpu_cores: number;
    cluster_name: string;
    cluster_location: string;
    pairing_complete: boolean;
    virtualization: string[];
}
