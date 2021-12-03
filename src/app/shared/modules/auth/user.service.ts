import {Injectable} from '@angular/core';
import {Observable, of, throwError} from "rxjs";
import {LoginRequest} from "../../../landingpage/login/login.component";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map} from 'rxjs/operators';
import {environment} from "../../../../environments/environment";
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedIn = false

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private router: Router) {
  }

  getUsername(): string {
    return this.getDecodedAccessToken(this.getAuthTokenRaw())["sub"]
  }

  login(request: LoginRequest): Observable<boolean> {
    return this.http.post<Response>(environment.apiUrl + "/auth/login", request).pipe(
      map((response: any) => {
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
          console.log(error) // TODO Why two times error.
          // server is running and returned a json string
          errorMsg = JSON.parse(error.error.message);
          console.log(errorMsg)
        }
        return throwError(error || 'Server error')
      }))
  }

  /** logs out the user */
  logout(): void {
    this.loggedIn = false
    //this.log.debug("UserService - removing tokens");
    localStorage.removeItem('api_token');
    localStorage.removeItem('api_refresh_token')
    this.router.navigate(['/'])
  }

  /** true if the user is logged in */
  isLoggedIn(): boolean {
    return !this.isTokenExpired(this.getAuthTokenRaw());
  }

  /** true if the refresh token is still valid */
  canRefresh(): boolean {
    return !this.isTokenExpired(this.getRefreshTokenRaw())
  }

  /** stores the token*/
  setAuthToken(token: string): void {
    localStorage.setItem('api_token', token)
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('api_refresh_token', token);
  }

  private tryTokenRenewal(): Observable<boolean> {
    const refreshToken = this.getRefreshTokenRaw();
    const requestOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + refreshToken,
      }),
    };

    return this.http.post(environment.apiUrl + "/auth/refresh", {}, requestOptions).pipe(
      map((response: any) => {
        this.setAuthToken(response.token);
        return true;
      }),
      catchError((error) => {
        const errorMsg = JSON.parse(error._body);
        //this.notify.error("Error", errorMsg.error || errorMsg.message);
        return throwError(error || 'Server error')
      }))
  }

  renewToken(): Observable<boolean> {
    return this.tryTokenRenewal().pipe(map(
        (res) => {
          //this.notify.success("Success", "Token renewal works!");
          return true;
        }),
      catchError(
        (error: Error) => {
          console.log(error)
          this.redirectToLogin()
          return of(false);
        })
    )
  }

  redirectToLogin(): void {
    //this.notify.error("Error", "Your session has expired.");
    this.logout();
    this.router.navigate(['/'], {queryParams: {returnUrl: ''}});
  }

  getDecodedAccessToken(token: any): any {
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
    return this.getJWTTokenRaw('api_refresh_token');
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

  isTokenExpired(token: any) {
    let d = this.getTokenExpirationDate(token);
    if (d === null) return false;
    // Token expired?
    return !(d.valueOf() > (new Date().valueOf()));
  };
}

