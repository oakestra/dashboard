import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../shared/modules/auth/user.service";
import {AuthService} from "../../shared/modules/auth/auth.service";
import {ApiService, LoginRequest, UserEntity} from "../../shared/modules/api/api.service";
import {NotificationService, Type} from "../../shared/modules/notification/notification.service";
import {environment} from "../../../environments/environment";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  //user: UserEntity;

  sm_ip = environment.apiUrl

  constructor(private router: Router) {}

  public submitRegister() {}

  loginForm() {
    this.router.navigate([''])
  }


    //public registerForm() {}

 /* public create_user_entity(): UserEntity {
    return {
      _id: {$oid: "set in the mongoDB"},
      name: "",
      password: "",
      email: "",
      created_at: "",
      roles: [],
    };
  }*/
}
