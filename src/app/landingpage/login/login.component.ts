import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../shared/modules/auth/user.service";
import {AuthService} from "../../shared/modules/auth/auth.service";
import {ApiService, LoginRequest, UserEntity} from "../../shared/modules/api/api.service";
import {NotificationService, Type} from "../../shared/modules/notification/notification.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user: UserEntity;

  constructor(private router: Router,
              private userService: UserService,
              private authService: AuthService,
              private notifyService: NotificationService,
              private api: ApiService) {
    this.user = this.create_user_entity();
  }

  public submitLogin() {
    if (this.user.name.length !== 0 && this.user.password.length !== 0) {

      const loginRequest: LoginRequest = {
        username: this.user.name,
        password: this.user.password
      };

      this.userService.login(loginRequest).subscribe(
        (userServiceResponse: any) => {
          if (userServiceResponse === true) {
            this.authService.getAuthorization().subscribe(() =>
              this.router.navigate(['/control'])
            )
          }
        },
        (error => this.notifyService.notify(Type.error, error.error.message))
      )
    } else {
      this.notifyService.notify(Type.error, "Please provide valid inputs for login.")
    }
  }

  forgotPassword() {
    if (this.user.name.length !== 0) {
      this.api.resetPassword(this.user.name).subscribe(
        () => {
          this.notifyService.notify(Type.success, "An email with a reset password link was sent")
        }
      )
    } else {
      this.notifyService.notify(Type.error, "Please provide a valid username")
    }
  }

  public create_user_entity(): UserEntity {
    return {
      _id: {$oid: "set in the mongoDB"},
      name: "Daniel", // Only for testing
      password: "1234",
      email: "",
      created_at: "",
      roles: [],
    };
  }
}
