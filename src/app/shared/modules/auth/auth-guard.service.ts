import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "./auth.service";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.userService.loggedIn) {
      return true
    } else {
      this.router.navigate(['/'], {queryParams: {returnUrl: state.url}})
      return false;
    }
    /*
        if (route.data.role === undefined) {
          return Observable.of(true);
        } else {
          return this.authService.hasRole(route.data.role).pipe(map((hasRole) => {
            if (!hasRole) {
              //this.notify.error("Error", "You have not enough permissions!");
              this.router.navigate(['/control2/experiments']);
            }
            return hasRole;
          }));
        }*/
  }
}
