import {Injectable} from '@angular/core';
import {UserService} from "./user.service";
import {Observable, of, pipe} from "rxjs";
import {ApiService, UserRole} from "../api/api.service";
import {map} from "rxjs/operators";

@Injectable()
export class AuthService {

  roles: UserRole[] | undefined;

  constructor(private userService: UserService,
              private api: ApiService) {
    this.roles = undefined;
  }

  getAuthorization(): Observable<{ roles: UserRole[] }> {
    if (!this.roles) {
      // let token = this.userService.getRefreshTokenRaw();
      return this.api.getAuthorization(this.userService.getUsername()).pipe(
        map((auth: { roles: UserRole[] }) => {
            this.roles = auth.roles;
            return auth;
          }
        ));
    } else {
      console.log("Roles still here")
      return of({roles: this.roles})
    }
  }

  hasRole(role: Role) {
    return this.getAuthorization().pipe(
      map(pipe((auth: { roles: UserRole[] }) => {
        console.log(auth)
        const found = auth.roles.find((role_) => role_.name === role);
        return found !== undefined;
      })));
  }

  clear(){
    this.roles = undefined;
  }
}

export class Role {
  static ADMIN = "Admin_Role";
}
