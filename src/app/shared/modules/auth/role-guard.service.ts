import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../../root/interfaces/notification';
import { UserService } from './user.service';
import { AuthService, Role } from './auth.service';

@Injectable()
export class RoleRouterGuard implements CanActivate, CanLoad, CanActivateChild {
    constructor(
        private router: Router,
        private userService: UserService,
        private authService: AuthService,
        private notifyService: NotificationService,
    ) {}

    doRoleCheck(): Observable<boolean> {
        return this.authService.hasRole(Role.ADMIN).pipe(
            map((hasRole) => {
                if (!hasRole) {
                    this.notifyService.notify(NotificationType.error, 'You have not enough permissions!');
                    void this.router.navigate(['/control']);
                }
                return hasRole;
            }),
        );
    }

    canActivate(): Observable<boolean> {
        return this.doRoleCheck();
    }

    canActivateChild(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.doRoleCheck();
    }

    canLoad() {
        return true;
    }
}
