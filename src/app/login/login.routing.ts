import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        pathMatch: 'full',
    },
    {
        path: 'resetPassword/:resetPasswordToken',
        component: ResetPasswordComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
        pathMatch: 'full',
    },
];
