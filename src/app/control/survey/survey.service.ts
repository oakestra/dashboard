import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/modules/api/api.service';
import { IUser } from '../../root/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  taskResults = [false, false, false, false, false];
  evaluated = false;
  correctTasks = 0;

  constructor(private api: ApiService) {}

  resetSurvey() {
    localStorage.removeItem('location');

    const user: IUser = {
      _id: { $oid: '123' },
      name: 'Evil-user',
      password: 'password',
      email: 'evil@evil.com',
      created_at: '01/01/2021 00:01',
      roles: [
        {
          name: 'Admin',
          description: 'This is the admin role',
        },
      ],
    };

    this.api.registerUser(user).subscribe(
      () => {
        console.log('registered user');
      },
      (error) => {
        if (!error.hasOwnProperty('_body')) {
          console.log('User already exists');
        }
      },
    );
    this.taskResults = [false, false, false, false, false];
    this.evaluated = false;
  }
}
