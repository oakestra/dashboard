import { IId } from './id';

export interface IService {
  _id: IId;
  microserviceID?: string;
  microservice_name?: string;
  microservice_namespace?: string;
  virtualization?: Virtualization;
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
}

enum Virtualization {
  Container = 'container',
  Unikernel = 'unikernel',
  Vm = 'vm',
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
