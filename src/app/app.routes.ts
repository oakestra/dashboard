import {AuthGuardService} from "./shared/modules/auth/auth-guard.service";
import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: 'control',
    loadChildren: () => import('src/app/control/control.module').then(m => m.ControlModule),
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    loadChildren: () => import('src/app/landingpage/landingpage.module').then(m => m.LandingPageModule),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/'
  }
];
