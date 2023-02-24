import { IApplication } from './application';

export interface ISla {
    sla_version: string;
    customerID: string;
    applications: IApplication[];
    args: string[];
}
