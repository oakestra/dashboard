import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../shared/modules/auth/user.service";
import {AuthService} from "../../shared/modules/auth/auth.service";
import {DbClientService} from "../../shared/modules/api/db-client.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserEntity;

  constructor(private router: Router,
              private userService : UserService,
              private authService: AuthService,
              private dbService: DbClientService,
              private datePipe: DatePipe) {
    this.user = this.create_user_entity();
  }

  ngOnInit(): void {
  }

  public submitLogin() {
    if (this.user.name.length !== 0 && this.user.password.length !== 0) {

      const loginRequest: LoginRequest = {
        username: this.user.name,
        password: this.user.password
      };

      this.userService.login(loginRequest).subscribe(
        (userServiceResponse:any) => {
          if (userServiceResponse === true) {
            // TODO getAuthorization ausführen um die rechte des Users zu erhalten
            this.authService.getAuthorization().subscribe(() => {
              this.router.navigate(['/control']);
              //ctrl.notify.success("Success", "You are signed-in successfully.");
            });
          }
        }
      )
    } else {
      console.log("error")
      //this.notify.error("Error", "Please provide valid inputs for login.");
    }
  }
  forgotPassword() {
    console.log("forgotPassword")
  }

  // TODO Extreact this as service
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

export interface UserEntity {
  name: string;
  password: string;
  email: string;
  created_at: string;
  roles: Array<UserRole>;// TODO implement them
}

export interface LoginRequest {
  username: string,
  password: string
}

export class UserRole {
  //role_id: number;
  name: string;
  description: string;
  //basic: boolean;
  //permissions: []
  // permissions: Array<Permission>;

  constructor() {
    this.name = "";
    this.description = "";
  }
}
