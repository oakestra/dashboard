import { Routes } from '@angular/router';
import { AuthGuardService } from '../shared/modules/auth/auth-guard.service';
import { RoleRouterGuard } from '../shared/modules/auth/role-guard.service';
import { NavbarComponent } from './navbar/navbar.component';
import { DevHomeComponent } from './dev-home/dev-home.component';
import { HelpComponent } from './help/help.component';
import { DeployFormComponent } from './deploy-form/deploy-form.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UsersComponent } from './users/users.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { SurveyComponent } from './survey/survey.component';
import { ClusterComponent } from './cluster/cluster.component';

export const routes: Routes = [
    {
        path: '',
        component: NavbarComponent,
        children: [
            {
                path: '',
                component: DevHomeComponent,
                pathMatch: 'full',
                canActivate: [AuthGuardService],
            },
            {
                path: 'help',
                component: HelpComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'survey',
                component: SurveyComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'deploy/:id',
                component: DeployFormComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'deploy',
                component: DeployFormComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'users',
                component: UsersComponent,
                canActivate: [AuthGuardService, RoleRouterGuard],
            },
            {
                path: 'profile',
                component: UserEditComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'cluster',
                component: ClusterComponent,
                canActivate: [AuthGuardService],
            },
            { path: '**', component: NotFoundComponent },
        ],
    },
];
