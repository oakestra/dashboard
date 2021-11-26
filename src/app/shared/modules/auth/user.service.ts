import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {LoginRequest} from "../../../landingpage/login/login.component";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {catchError, map} from 'rxjs/operators';
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  username = ""
  loggedIn = false

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
  }

  getUsername(): string {
    return this.username
    //return this.getAuthToken()["value"]["sub"];
  }

  login(request: LoginRequest): Observable<boolean> {
    console.log("UserService - starting LoginRequest")
    console.log(request)
    return this.http.post<Response>(environment.apiUrl + "/auth/login", request).pipe(
      map((response: Response) => {
        console.log("UserService - request successful")
        console.log(response)

        this.username = request.username
        this.loggedIn = true
        //this.setAuthToken(response.json().token);
        //this.setRefreshToken(response.json().refresh_token); // TODO Get tokens and store them
        return true;
      }),
      catchError((error: any) => {
        let errorMsg: any = {};
        // server is not running
        if (typeof (error._body) == 'object') {
          errorMsg.message = "Server is not running";
        } else {
          console.log(error.error.message) // TODO Why two times error.
          // server is running and returned a json string
          errorMsg = JSON.parse(error.error.message);
          console.log(errorMsg)
        }
        //this.notify.error("Error", errorMsg.error || errorMsg.message);
        return Observable.throw(error || 'Server error');
      }))
  }

  /** logs out the user */
  logout(): void {
    this.loggedIn = false
    this.username = ""

    console.log("UserService - removing tokens");
    //this.log.debug("UserService - removing tokens");
    localStorage.removeItem('oeda_token');
    localStorage.removeItem('oeda_refresh_token')
    this.router.navigate(['/'])
  }

}
