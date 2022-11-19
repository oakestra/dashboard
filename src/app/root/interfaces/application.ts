import { IId } from './id';

export interface IApplication {
  _id: IId;
  application_name: string;
  application_namespace: string;
  application_desc: string;
}
