import {NavbarComponent} from "./navbar/navbar.component";
import {Routes} from "@angular/router";
import {DevHomeComponent} from "./dev-home/dev-home.component";
import {HelpComponent} from "./help/help.component";
import {DeployFormComponent} from "./deploy-form/deploy-form.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {UsersComponent} from "./users/users.component";
import {AuthGuardService} from "../shared/modules/auth/auth-guard.service";
import {UserEditComponent} from "./users/user-edit/user-edit.component";
import {RoleRouterGuard} from "../shared/modules/auth/role-guard.service";

export const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [
      {
        path: '',
        component: DevHomeComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardService]
      },
      {
        path: 'help',
        component: HelpComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'deploy/:id',
        component: DeployFormComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'deploy',
        component: DeployFormComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuardService,RoleRouterGuard]
      },
      {
        path: 'profile',
        component: UserEditComponent,
        canActivate: [AuthGuardService]
      },
      {path: '**', component: NotFoundComponent}
    ]
  }
];

