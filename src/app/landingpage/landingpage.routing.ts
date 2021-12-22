import {LoginComponent} from "./login/login.component";
import {Routes} from "@angular/router";
import {LandingpageComponent} from "./landingpage.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";

export const routes: Routes = [
  {
    path: '',
    component: LandingpageComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
        pathMatch: 'full'
      },
      {
        path: 'resetPassword/:resetPasswordToken',
        component: ResetPasswordComponent,
      }
    ]
  }
];
