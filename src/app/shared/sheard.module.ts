import {ErrorHandler, ModuleWithProviders, NgModule} from "@angular/core";
import {UserService} from "./modules/auth/user.service";
import {DataService} from "./modules/api/data.service";
import {SharedIDService} from "./modules/helper/shared-id.service";
import {AuthService} from "./modules/auth/auth.service";
import {AuthGuardService} from "./modules/auth/auth-guard.service";
import {AppErrorHandler} from "../app-error-handler";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {CommonInterceptor} from "./util/common.interceptor";
import {DatePipe} from "@angular/common";

@NgModule({
  imports: [],
  exports: [],
  providers: [
    UserService,
    DataService,
    SharedIDService,
    AuthService,
    AuthGuardService,
    DatePipe
  ]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SharedModule,
      // Here (and only here!) are all global shared services
      providers: [
        {
          provide:
          ErrorHandler, useClass: AppErrorHandler
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CommonInterceptor,
          multi: true,
        },
        UserService,
        DataService,
        SharedIDService,
        AuthService,
        AuthGuardService,
      ]
    };
  }
}
