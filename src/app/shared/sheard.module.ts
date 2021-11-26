import {ErrorHandler, ModuleWithProviders, NgModule} from "@angular/core";
import {UserService} from "./modules/auth/user.service";
import {DataService} from "./modules/api/data.service";
import {SharedIDService} from "./modules/helper/shared-id.service";
import {AuthService} from "./modules/auth/auth.service";
import {AuthGuardService} from "./modules/auth/auth-guard.service";
import {AppErrorHandler} from "../app-error-handler";

@NgModule({
  imports: [],
  exports: [],
  providers: [
    UserService,
    DataService,
    SharedIDService,
    AuthService,
    AuthGuardService,
  ]
})
export class SharedModule {


  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SharedModule,
      // Here (and only here!) are all global shared services
      providers: [
        {provide: ErrorHandler, useClass: AppErrorHandler},
        UserService,
        DataService,
        SharedIDService,
        AuthService,
        AuthGuardService,
      ]
    };
  }
}
