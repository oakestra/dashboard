import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  RouterStateSnapshot
} from "@angular/router";
import {UserService} from "./user.service";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements  CanActivate, CanLoad, CanActivateChild  {

  constructor(private userService: UserService) {
  }

  doUserCheck(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
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

  canLoad(router: Route) {
    return true // this.doUserCheck()
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.doUserCheck(childRoute, state)
  }
}
