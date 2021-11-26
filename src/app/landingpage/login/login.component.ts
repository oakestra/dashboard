import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../shared/modules/auth/user.service";
import {AuthService} from "../../shared/modules/auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserEntity;

  constructor(private router: Router,
              private userService : UserService,
              private authService: AuthService) {
    this.user = this.create_user_entity();
  }

  ngOnInit(): void {
  }

  public submitLogin() {
    console.log("Submit")
    if (this.user.name.length !== 0 && this.user.password.length !== 0) {

      const loginRequest: LoginRequest = {
        username: this.user.name,
        password: this.user.password
      };

      this.userService.login(loginRequest).subscribe(
        (userServiceResponse:any) => {
          if (userServiceResponse === true) {
            // TODO getAuthorization ausführen um die rechte des Users zu erhalten
            //this.authService.getAuthorization().subscribe(() => {
              this.router.navigate(['/control']);
              //ctrl.notify.success("Success", "You are signed-in successfully.");
            //});
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
      db_configuration: new Map<string, string>(),
      //roles: [],
    };
  }
}

export interface UserEntity {
  name: string;
  password: string;
  db_configuration: Map<string, string>;
  email: string;
  created_at: string;
  //roles: Array<UserRole>; TODO implement them
}

export interface LoginRequest {
  username: string,
  password: string
}

export class UserRole {
  role_id: number;
  name: string;
  description: string;
  basic: boolean;
  permissions: []
  // permissions: Array<Permission>;

  constructor() {
    this.role_id = 3 // von mir
    this.name = "";
    this.description = "";
    this.permissions = [] // später ändern
    this.basic = false;
  }

}

export class Permission {
  /** allows access to the system status page */
  // static FOUND_SYSINFO_READ = new Permission(0, "FOUND_SYSINFO_READ");

  constructor() {}

  id: number = 0;
  name: PermissionName | undefined;
  access_all: boolean = false;

  static fromJSON(permissionJSON: any): Permission {
    const permission = new Permission();
    permission.id = permissionJSON.id;
    for (let i = 0; i < PermissionNameString.NAME.length; ++i) {
      if (PermissionNameString.NAME[i] === permissionJSON.name) {
        permission.name = i;
        break;
      }
    }
    permission.access_all = permissionJSON.access_all;
    return permission;
  }

  static toJSON(
    id: number,
    permissionName: PermissionName,
    access_all: boolean,
    is_active: boolean
  ) {
    return {
      id: id,
      name: PermissionNameString.NAME[permissionName],
      access_all: access_all,
      is_active: is_active,
    };
  }
}

export enum PermissionName {
  GET_TARGETSYSTEM,
  WRITE_TARGETSYSTEM,
  DEL_TARGETSYSTEM,
  GET_EXPERIMENT,
  WRITE_EXPERIMENT,
  DEL_EXPERIMENT,
  WRITE_DATASTORAGE,
}

export class PermissionNameString {
  static NAME = [
    "GET_TARGETSYSTEM",
    "WRITE_TARGETSYSTEM",
    "DEL_TARGETSYSTEM",
    "GET_EXPERIMENT",
    "WRITE_EXPERIMENT",
    "DEL_EXPERIMENT",
    "WRITE_DATASTORAGE",
  ];
}
