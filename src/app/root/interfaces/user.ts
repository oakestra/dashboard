import { IId } from './id';

export interface IUser {
  _id: IId;
  name: string;
  password: string;
  email: string;
  created_at: string;
  roles: Array<IUserRole>;
}
export interface ILoginRequest {
  username: string;
  password: string;
}

export class IUserRole {
  name: string;
  description: string;

  constructor() {
    this.name = '';
    this.description = '';
  }
}
