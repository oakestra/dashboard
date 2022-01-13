import {Injectable} from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from "@angular/router";
import {UserService} from "./user.service";
import {NotificationService, Type} from "../notification/notification.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AuthService, Role} from "./auth.service";

@Injectable()
export class RoleRouterGuard implements CanActivate, CanLoad, CanActivateChild {

  constructor(private router: Router,
              private userService: UserService,
              private authService: AuthService,
              private notifyService: NotificationService) {
  }

  doRoleCheck(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.hasRole(Role.ADMIN).pipe(
      map((hasRole) => {
        if (!hasRole) {
          this.notifyService.notify(Type.error, "You have not enough permissions!")
          this.router.navigate(['/control']);
        }
        return hasRole;
      }));
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.doRoleCheck(route, state)
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.doRoleCheck(childRoute, state);
  }

  canLoad(route: Route, segments: UrlSegment[]) {
    return true
  }
}
