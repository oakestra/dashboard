import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../shared/modules/auth/user.service";
import {AuthService} from "../../shared/modules/auth/auth.service";
import {LoginRequest, UserEntity} from "../../shared/modules/api/api.service";
import {NotificationService, Type} from "../../shared/modules/notification/notification.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  user: UserEntity;

  constructor(private router: Router,
              private userService: UserService,
              private authService: AuthService,
              private notifyService: NotificationService) {
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
            this.authService.getAuthorization().subscribe(() => {
              this.router.navigate(['/control']);
              //ctrl.notify.success("Success", "You are signed-in successfully.");
            });
          }
        }
      )
    } else {
      console.log("error")
      this.notifyService.notify(Type.error, "Please provide valid inputs for login.")
    }
  }

  forgotPassword() {
    console.log("forgotPassword")
  }

  public create_user_entity(): UserEntity {
    return {
      name: "Daniel", // Normaleriweise leer lassen
      password: "1234",
      email: "",
      created_at: "",
      roles: [],
    };
  }
}
