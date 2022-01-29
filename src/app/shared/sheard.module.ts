import {ModuleWithProviders, NgModule} from "@angular/core";
import {UserService} from "./modules/auth/user.service";
import {SharedIDService} from "./modules/helper/shared-id.service";
import {AuthService} from "./modules/auth/auth.service";
import {AuthGuardService} from "./modules/auth/auth-guard.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {CommonInterceptor} from "./util/common.interceptor";
import {CommonModule, DatePipe} from "@angular/common";
import {NotificationService} from "./modules/notification/notification.service";
import {NotificationComponent} from './modules/notification/notification.component';
import {MatIconModule} from "@angular/material/icon";
import {RoleRouterGuard} from "./modules/auth/role-guard.service";
// import {environment} from "../../environments/environment.prod";

@NgModule({
  imports: [
    MatIconModule,
    CommonModule
  ],
  exports: [],
  providers: [
    UserService,
    SharedIDService,
    AuthService,
    AuthGuardService,
    DatePipe,
    RoleRouterGuard,
    // {provide: 'BACKEND_API_URL', useValue: environment.apiUrl}
    ],
  declarations: [


    NotificationComponent
  ]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SharedModule,
      // Here (and only here!) are all global shared services
      providers: [
        // {
        //   provide:
        //   ErrorHandler, useClass: AppErrorHandler
        // },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CommonInterceptor,
          multi: true,
        },
        UserService,
        SharedIDService,
        AuthGuardService,
        NotificationService
      ]
    };
  }
}
