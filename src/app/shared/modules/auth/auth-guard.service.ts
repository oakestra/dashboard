import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService implements CanActivate, CanLoad, CanActivateChild {
    constructor(private userService: UserService) {}

    doUserCheck(): Observable<boolean> {
        if (!this.userService.isLoggedIn()) {
            if (this.userService.canRefresh()) {
                return this.userService.renewToken();
            } else {
                this.userService.redirectToLogin();
                return of(false);
            }
        }
        return of(true);
    }

    canActivate() {
        return this.doUserCheck();
    }

    canLoad() {
        return true; // this.doUserCheck()
    }

    canActivateChild(): Observable<boolean> {
        return this.doUserCheck();
    }
}
