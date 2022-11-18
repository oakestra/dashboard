import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Observable, of, pipe } from 'rxjs';
import { ApiService, UserRole } from '../api/api.service';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  roles: UserRole[] | undefined;

  constructor(private userService: UserService, private api: ApiService) {
    this.roles = undefined;
  }

  getAuthorization(): Observable<{ roles: UserRole[] }> {
    if (!this.roles) {
      return this.api.getAuthorization(this.userService.getUsername()).pipe(
        map((auth: { roles: UserRole[] }) => {
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
        pipe((auth: { roles: UserRole[] }) => {
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
