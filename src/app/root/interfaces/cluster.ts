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
    addons_engine_url?: string;
    addonsEngineUrl?: string;
    addons_manager_url?: string;
    resource_abstractor_url?: string;
    resourceAbstractorUrl?: string;
    ip?: string;
    cluster_ip?: string;
    public_ip?: string;
    node_ip?: string;
    host?: string;
    hostname?: string;
    address?: string;
    cluster_address?: string;
}
