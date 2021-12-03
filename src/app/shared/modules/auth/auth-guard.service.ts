import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "./auth.service";
import {UserService} from "./user.service";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService,
              private userService: UserService) {
  }

  doUserCheck(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this.userService.isLoggedIn()) {
      if (this.userService.canRefresh()) {
        return this.userService.renewToken();
      } else {
        this.userService.redirectToLogin();
        return of(false);
      }
    }
    //this.router.navigate(['/'], {queryParams: {returnUrl: state.url}}) to get to the requested link
    return of(true);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.doUserCheck(route, state)
  }
}
