export interface IWorkerToken {
    token: string;
    expires_at: string;
    cluster_address: string;
    cluster_port: number;
    suggested_command: string;
}
