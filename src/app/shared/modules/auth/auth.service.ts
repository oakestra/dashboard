import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Observable, of, pipe } from 'rxjs';
import { ApiService } from '../api/api.service';
import { map } from 'rxjs/operators';
import { IUserRole } from '../../../root/interfaces/user';

@Injectable()
export class AuthService {
  roles: IUserRole[] | undefined;

  constructor(private userService: UserService, private api: ApiService) {
    this.roles = undefined;
  }

  getAuthorization(): Observable<{ roles: IUserRole[] }> {
    if (!this.roles) {
      return this.api.getAuthorization(this.userService.getUsername()).pipe(
        map((auth: { roles: IUserRole[] }) => {
          this.roles = auth.roles;
          return auth;
        }),
      );
    } else {
      return of({ roles: this.roles });
    }
  }

  hasRole(role: Role) {
    return this.getAuthorization().pipe(
      map(
        pipe((auth: { roles: IUserRole[] }) => {
          const found = auth.roles.find((role_) => role_.name === role);
          return found !== undefined;
        }),
      ),
    );
  }

  clear() {
    this.roles = undefined;
  }
}

export class Role {
  static ADMIN = 'Admin';
}
