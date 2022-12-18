import { ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from './modules/auth/user.service';
import { SharedIDService } from './modules/helper/shared-id.service';
import { AuthService } from './modules/auth/auth.service';
import { AuthGuardService } from './modules/auth/auth-guard.service';
import { CommonInterceptor } from './util/common.interceptor';
import { NotificationService } from './modules/notification/notification.service';
import { NotificationComponent } from './modules/notification/notification.component';
import { RoleRouterGuard } from './modules/auth/role-guard.service';
import { WINDOW_PROVIDERS } from './modules/helper/window.providers';

@NgModule({
    imports: [MatIconModule, CommonModule, MatButtonModule],
    exports: [],
    providers: [
        UserService,
        SharedIDService,
        AuthService,
        AuthGuardService,
        DatePipe,
        RoleRouterGuard,
        WINDOW_PROVIDERS,
    ],
    declarations: [NotificationComponent],
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<any> {
        return {
            ngModule: SharedModule,
            // Here (and only here!) are all global shared services
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: CommonInterceptor,
                    multi: true,
                },
                UserService,
                SharedIDService,
                AuthGuardService,
                NotificationService,
            ],
        };
    }
}
