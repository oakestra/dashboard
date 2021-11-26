import {HelpComponent} from "../control/help/help.component";
import {LoginComponent} from "./login/login.component";
import {Routes} from "@angular/router";
import {LandingpageComponent} from "./landingpage.component";

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
        component: HelpComponent, // TODO Das richtige Component muss noch erstellt werden
      }
    ]
  }
];
