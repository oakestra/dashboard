import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../shared/modules/auth/user.service';
import { AuthService } from '../../../shared/modules/auth/auth.service';
import { ApiService } from '../../../shared/modules/api/api.service';
import { NotificationService } from '../../../shared/modules/notification/notification.service';
import { environment } from '../../../../environments/environment';
import { ILoginRequest } from '../../../root/interfaces/user';
import { NotificationType } from '../../../root/interfaces/notification';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    sm_ip = environment.apiUrl;
    form: FormGroup;
    useOrganization = false;
    showPassword = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private authService: AuthService,
        private notifyService: NotificationService,
        private api: ApiService,
        private fb: FormBuilder,
    ) {
        this.form = fb.group({
            organization_name: ['', [Validators.required]],
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });

        this.form.get('organization_name').disable();
    }

    getInputType() {
        if (this.showPassword) {
            return 'text';
        }
        return 'password';
    }

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    public tabChanged(checked: boolean) {
        this.useOrganization = checked;
        if (this.useOrganization) {
            this.form.get('organization_name').enable();
        } else {
            this.form.get('organization_name').disable();
        }
    }

    public submitLogin() {
        const loginRequest: ILoginRequest = {
            ...this.form.value,
        };

        this.userService.login(loginRequest).subscribe({
            next: () => {
                void this.router.navigate(['/control']);
            },
            error: (error) => this.notifyService.notify(NotificationType.error, error),
        });
    }

    public forgotPassword() {
        // TODO Implement send mail functionality
        const username = this.form.get('username');
        console.log('SEND MAIL');
        if (username?.valid) {
            this.api.resetPassword(username.value).subscribe(() => {
                this.notifyService.notify(NotificationType.success, 'An email with a reset password link was sent');
            });
        } else {
            this.notifyService.notify(NotificationType.error, 'Please provide a valid username');
        }
    }
}
