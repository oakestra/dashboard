import { Routes } from '@angular/router';
import { AuthGuardService } from '../shared/modules/auth/auth-guard.service';
import { RoleRouterGuard } from '../shared/modules/auth/role-guard.service';
import { NavbarComponent } from './navbar/navbar.component';
import { DevHomeComponent } from './dev-home/dev-home.component';
import { HelpComponent } from './help/help.component';
import { SlaFormComponent } from './sla-form/sla-form.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { InfrastructureComponent } from './infrastructure/infrastructure.component';
import { OrganizationComponent } from './organization/organization.component';
import { SettingsComponent } from './settings/settings.component';
import { ApplicationsComponent } from './applications/applications.component';
import { FaqComponent } from './faq/faq.component';

export const routes: Routes = [
    {
        path: '',
        component: NavbarComponent,
        children: [
            {
                path: '',
                component: ApplicationsComponent,
                pathMatch: 'full',
                canActivate: [AuthGuardService],
            },
            {
                path: 'services',
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
                path: 'deploy/:id',
                component: SlaFormComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'deploy',
                component: SlaFormComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'users',
                component: UsersComponent,
                canActivate: [AuthGuardService, RoleRouterGuard],
            },
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'organization',
                component: OrganizationComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'settings',
                component: SettingsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'faq',
                component: FaqComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'infrastructure',
                component: InfrastructureComponent,
                canActivate: [AuthGuardService],
                data: {
                    role: 'ADMIN',
                },
            },
            /*
            {
                path: 'cluster',
                component: ClusterComponent,
                canActivate: [AuthGuardService],
            },*/
            { path: '**', component: NotFoundComponent },
        ],
    },
];
