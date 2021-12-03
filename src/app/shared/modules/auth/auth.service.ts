import {Injectable} from '@angular/core';
import {UserService} from "./user.service";
import {UserRole} from "../../../landingpage/login/login.component";
import {Observable, of, pipe} from "rxjs";
import {DbClientService} from "../api/db-client.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  roles: UserRole[] | undefined;

  constructor(private userService: UserService,
              private dbService: DbClientService) {
  }

    getAuthorization(): Observable<{ roles: UserRole[] }> {
      if (!this.roles) {
        let token = this.userService.getRefreshTokenRaw();
        return this.dbService.getAuthorization(this.userService.getUsername(),token).pipe(
          map((auth: { roles: UserRole[] }) => {
              this.roles = auth.roles;
              return auth;
            }
          ));
      } else {
        return of({roles: this.roles})
      }
    }

  hasRole(role: Role) {
    return this.getAuthorization().pipe(
      map(pipe((auth: { roles: UserRole[]}) => {
      const found = auth.roles.find((role_) => role_.name === role);
      return found !== undefined;
    })));
  }
}

export class Role {
  static ADMIN = "Admin_Role";
}
