import {Injectable} from '@angular/core';
import {UserService} from "./user.service";
import {Permission, UserRole} from "../../../landingpage/login/login.component";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  permissions: Permission[] | undefined;
  roles: UserRole[] | undefined;

  constructor(private userService: UserService) {
  }

  // Sollte späte die api anfragen welche Rechte ein Benutzer hat.
  getAuthorization() {
    return true;
  }

  /* TODO implement the api call so this can work
    getAuthorization2(): Observable<{ roles: UserRole[], permissions: Permission[] }> {
      if (!this.permissions || !this.roles) {
        return this.api.getAuthorization(this.userService.getUsername()).pipe(
          map((auth: { roles: UserRole[], permissions: Permission[] }) => {
              this.permissions = auth.permissions;
              this.roles = auth.roles;
              return auth;
            }
          ));
      } else {
        return of({roles: this.roles, permissions: this.permissions})
      }
    }*/

  hasRole(data: any) {
    return this.getAuthorization()
    /*
    return this.getAuthorization().map(pipe((auth: { roles: UserRole[], permissions: Permission[] }) => {
      const found = auth.roles.find((role_) => role_.name === role);
      return found !== undefined;
    }));*/
  }
}
