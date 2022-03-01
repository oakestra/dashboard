import {Injectable} from '@angular/core';
import {ApiService, UserEntity} from "../../shared/modules/api/api.service";

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  taskResults = [false, false, false, false, false]
  evaluated = false;
  correctTasks = 0

  constructor(private api: ApiService){
  }

  resetSurvey() {

    localStorage.removeItem('location');

    let user: UserEntity = {
      '_id': {'$oid': '123'},
      'name': "Evil-user",
      'password': "password",
      'email': "evil@evil.com",
      created_at: "01/01/2021 00:01",
      roles: [{
        name: "Admin",
        description: "This is the admin role"
      }]
    }

    this.api.registerUser(user).subscribe(
      () => {
      }, error => {
        if (!error.hasOwnProperty("_body")) {
          console.log("User already exists")
        }
      }
    )
    this.taskResults = [false, false, false, false, false]
    this.evaluated = false
  }
}
