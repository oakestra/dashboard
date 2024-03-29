import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService implements CanActivate, CanLoad, CanActivateChild {
    constructor(private userService: UserService) {}

    doUserCheck(route: ActivatedRouteSnapshot): Observable<boolean> {
        if (!this.userService.isLoggedIn()) {
            if (this.userService.canRefresh()) {
                return this.userService.renewToken();
            } else {
                this.userService.redirectToLogin();
                console.log(route);
                return of(false);
            }
        }
        return of(true);
    }

    canActivate(next: ActivatedRouteSnapshot) {
        return this.doUserCheck(next);
    }

    canLoad(next: ActivatedRouteSnapshot) {
        return this.doUserCheck(next);
    }

    canActivateChild(next: ActivatedRouteSnapshot): Observable<boolean> {
        return this.doUserCheck(next);
    }
}
