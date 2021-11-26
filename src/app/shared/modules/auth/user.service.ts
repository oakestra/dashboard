import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {LoginRequest} from "../../../landingpage/login/login.component";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {catchError, map} from 'rxjs/operators';
import {environment} from "../../../../environments/environment";
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedIn = false

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
  }

  getUsername(): string {
    return this.getDecodedAccessToken(this.getAuthTokenRaw())["sub"]
  }

  login(request: LoginRequest): Observable<boolean> {
    console.log("UserService - starting LoginRequest")
    console.log(request)
    return this.http.post<Response>(environment.apiUrl + "/auth/login", request).pipe(
      map((response: any) => {
        console.log("UserService - request successful")
        console.log(response)
        this.loggedIn = true

        this.setAuthToken(response.token);
        this.setRefreshToken(response.refresh_token);
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

    console.log("UserService - removing tokens");
    //this.log.debug("UserService - removing tokens");
    localStorage.removeItem('api_token');
    localStorage.removeItem('api_refresh_token')
    this.router.navigate(['/'])
  }

  /** true if the user is logged in */
  isLoggedIn(): boolean {
    return !this.isTokenExpired(this.getAuthTokenRaw());
  }

  canRefresh(): boolean {
    return !this.isTokenExpired(this.getRefreshTokenRaw())
  }

  /** stores the token*/
  setAuthToken(token: string): void {
    console.log("gesetzt")
    localStorage.setItem('api_token', token)
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('api_refresh_token', token);
  }
/*
// TODO Add refereshToken to the Server
  private tryTokenRenewal(): Observable<boolean> {
    console.log("UserService - reauth requested")
    const authHeader = new Headers();
    const refreshToken = this.getRefreshTokenRaw();
    authHeader.append('Authorization', 'Bearer ' + refreshToken.get());
    console.log("request")
    return this.http.post(environment.apiUrl + "/auth/refresh", {},
      {headers: authHeader})
      .map((response: Response) => {
        console.log(response);
        this.setAuthToken(response.json().token);
        return true;
      }).catch((error) => {
        const errorMsg = JSON.parse(error._body);
        this.notify.error("Error", errorMsg.error || errorMsg.message);
        return Observable.throw(error || 'Server error')
      })
  }

 */

/*
  renewToken(): Observable<boolean> {
    return this.tryTokenRenewal().pipe(map(
        (res) => {
          //this.notify.success("Success", "Token renewal works!");
          return true;
        }),
      catchError(
        (error: Error) => {
          this.redirectToLogin()
          return of(false);
        })
    )
  }*/

  getDecodedAccessToken(token:any): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      console.log(Error)
      return null;
    }
  }

  /** returns the token stored in localStorage */
  getAuthTokenRaw(): string {
    return this.getJWTTokenRaw('api_token');
  }

  getRefreshTokenRaw(): string {
    return this.getJWTTokenRaw('oeda_refresh_token');
  }

  getJWTTokenRaw(key: string): string {
    const token = localStorage.getItem(key);
    if (token == null || token.split('.').length !== 3) {
      return "" // Todo throw arrow
    } else {
      return token
    }
  }

  private getTokenExpirationDate(token: any) {
    let decoded = this.getDecodedAccessToken(token);

    if (typeof decoded.exp === "undefined") return null;

    let d = new Date(0); // The 0 here is the key, which sets the date to the epoch
    d.setUTCSeconds(decoded.exp);

    return d;
  };

  isTokenExpired(token:any) {
    let d = this.getTokenExpirationDate(token);
    console.log(d)
    // let offsetSeconds = offsetSeconds || 0;
    if (d === null) return false;

    // Token expired?
    return !(d.valueOf() > (new Date().valueOf()));
  };


}

/** the format of tokens we use for auth*/
export interface JWTToken {
  id: string,
  value: string,
  roles: string[],
  representsArtists: string[],
  monitorsArtists: string[],
  permissions: number,
  exp: number,
  nbf: number
}
