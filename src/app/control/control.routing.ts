import {NavbarComponent} from "./navbar/navbar.component";
import {Routes} from "@angular/router";
import {DevHomeComponent} from "./dev-home/dev-home.component";
import {HelpComponent} from "./help/help.component";
import {DeployFormComponent} from "./deploy-form/deploy-form.component";
import {NotFoundComponent} from "./not-found/not-found.component";

export const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [
      {
        path: '',
        component: DevHomeComponent,
        pathMatch: 'full'
      },
      {
        path: 'help',
        component: HelpComponent,
      },
      {
        path: 'deploy/:id',
        component: DeployFormComponent
      },
      {
        path: 'deploy',
        component: DeployFormComponent
      },
      {path: '**', component: NotFoundComponent}
    ]
  }
];

