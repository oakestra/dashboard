import { IId } from './id';
import { IService } from './service';

export interface IApplication {
    _id: IId;
    application_name: string;
    application_namespace: string;
    application_desc: string;
    microservices?: IService[];
}
