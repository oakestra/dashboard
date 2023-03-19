import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router } from '@angular/router';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../../root/interfaces/notification';
import { Role } from '../../../root/enums/roles';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable()
export class RoleRouterGuard implements CanActivate, CanLoad, CanActivateChild {
    constructor(
        private router: Router,
        private userService: UserService,
        private authService: AuthService,
        private notifyService: NotificationService,
    ) {}

    doRoleCheck(): boolean {
        if (!this.userService.hasRole(Role.ADMIN)) {
            this.notifyService.notify(NotificationType.error, 'You have not enough permissions!');
            void this.router.navigate(['/control']);
            return false;
        }
        return true;
    }

    canActivate(): boolean {
        return this.doRoleCheck();
    }

    canActivateChild(): boolean {
        return this.doRoleCheck();
    }

    canLoad() {
        return true;
    }
}
