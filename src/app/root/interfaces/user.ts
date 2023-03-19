import { Role } from '../enums/roles';
import { IId } from './id';

export interface IUser {
    _id: IId;
    name: string;
    password: string;
    email: string;
    created_at: string;
    roles: Array<Role>;
}
export interface ILoginRequest {
    organization?: string;
    username: string;
    password: string;
}
