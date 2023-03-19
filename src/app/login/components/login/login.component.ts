import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
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
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    sm_ip = environment.apiUrl;
    form: FormGroup;
    useOrganization = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private authService: AuthService,
        private notifyService: NotificationService,
        private api: ApiService,
        private fb: FormBuilder,
    ) {
        this.form = fb.group({
            organization: ['', [Validators.required]],
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });

        this.form.get('organization').disable();
    }

    public tabChanged(event: MatCheckboxChange) {
        this.useOrganization = event.checked;
        if (this.useOrganization) {
            this.form.get('organization').enable();
        } else {
            this.form.get('organization').disable();
        }
    }

    public submitLogin() {
        const loginRequest: ILoginRequest = {
            ...this.form.value,
        };

        this.userService.login(loginRequest).subscribe({
            next: (userServiceResponse: boolean) => {
                if (userServiceResponse) {
                    this.authService.getAuthorization().subscribe(() => void this.router.navigate(['/control']));
                }
            },
            error: (error) => this.notifyService.notify(NotificationType.error, error),
        });
    }

    public forgotPassword() {
        const username = this.form.get('username');
        if (username?.valid) {
            this.api.resetPassword(username.value).subscribe(() => {
                this.notifyService.notify(NotificationType.success, 'An email with a reset password link was sent');
            });
        } else {
            this.notifyService.notify(NotificationType.error, 'Please provide a valid username');
        }
    }
}
