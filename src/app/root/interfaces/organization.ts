import { IId } from './id';

export interface IOrganization {
    _id?: IId;
    name: string;
    member: string[];
}
