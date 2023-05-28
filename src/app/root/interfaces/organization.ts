import { Role } from '../enums/roles';
import { IId } from './id';

export interface IOrganization {
    _id?: IId;
    name: string;
    member: RoleEntry[];
}

export interface RoleEntry {
    user_id: string;
    roles: Role[];
}
