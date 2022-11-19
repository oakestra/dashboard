import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/modules/auth/user.service';
import { AuthService } from '../../../shared/modules/auth/auth.service';
import { ApiService } from '../../../shared/modules/api/api.service';
import { NotificationService, Type } from '../../../shared/modules/notification/notification.service';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILoginRequest } from '../../../root/interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  sm_ip = environment.apiUrl;
  form: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private notifyService: NotificationService,
    private api: ApiService,
    private fb: FormBuilder,
  ) {
    this.form = fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  public submitLogin() {
    const username = this.form.get('username');
    const password = this.form.get('password');
    if (username?.valid && password?.valid) {
      const loginRequest: ILoginRequest = {
        username: username.value,
        password: password.value,
      };

      this.userService.login(loginRequest).subscribe(
        (userServiceResponse: boolean) => {
          if (userServiceResponse) {
            this.authService.getAuthorization().subscribe(() => this.router.navigate(['/control']));
          }
        },
        (error) => this.notifyService.notify(Type.error, error),
      );
    } else {
      this.notifyService.notify(Type.error, 'Please provide valid inputs for login.');
    }
  }

  public forgotPassword() {
    const username = this.form.get('username');
    if (username?.valid) {
      this.api.resetPassword(username.value).subscribe(() => {
        this.notifyService.notify(Type.success, 'An email with a reset password link was sent');
      });
    } else {
      this.notifyService.notify(Type.error, 'Please provide a valid username');
    }
  }

  public registerForm() {
    this.router.navigate(['/register']);
  }
}
