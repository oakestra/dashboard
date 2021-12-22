import {Injectable} from '@angular/core';
import {Observable, of, throwError} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map} from 'rxjs/operators';
import {environment} from "../../../../environments/environment";
import jwt_decode from 'jwt-decode';
import {LoginRequest} from "../api/api.service";
import {NotificationService, Type} from "../notification/notification.service";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedIn = false

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private router: Router,
              private notifyService: NotificationService) {
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
          console.log(error)
          // server is running and returned a json string
          errorMsg = error.error.message;
          console.log(errorMsg)

        }
        // return throwError(error || 'Server error')
        return throwError(error || 'Server error')
      }))
  }

  /** logs out the user */
  logout(): void {
    this.loggedIn = false
    //this.log.debug("UserService - removing tokens");
    localStorage.removeItem('api_token');
    localStorage.removeItem('api_refresh_token')
    this.router.navigate(['/'], { replaceUrl: true });
  }

  /** true if the user is logged in */
  isLoggedIn(): boolean {
    if(this.checkIfTokenExists('api_token')){
      return !this.isTokenExpired(this.getAuthTokenRaw());
    }
    return false
  }

  /** true if the refresh token is still valid */
  canRefresh(): boolean {
    return !this.isTokenExpired(this.getRefreshTokenRaw())
  }

  /** stores the auth token*/
  setAuthToken(token: string): void {
    localStorage.setItem('api_token', token)
  }

  /** stores the refresh token*/
  setRefreshToken(token: string): void {
    localStorage.setItem('api_refresh_token', token);
  }

  private tryTokenRenewal(): Observable<boolean> {
    const refreshToken = this.getRefreshTokenRaw();
    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + refreshToken,
      }),
    };

    return this.http.post(environment.apiUrl + "/auth/refresh", {}, requestOptions).pipe(
      map((response: any) => {
        this.setAuthToken(response.token);
        return true;
      }),
      catchError((error) => {
        this.notifyService.notify(Type.error, error.error.message)
        //this.notify.error("Error", errorMsg.error || errorMsg.message);
        return throwError(error || 'Server error')
      }))
  }

  renewToken(): Observable<boolean> {
    return this.tryTokenRenewal().pipe(map(
        () => {
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
    this.notifyService.notify(Type.error, "Your session has expired." )
    this.logout();
    this.router.navigate(['/']);
  }

  getDecodedAccessToken(token: any): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      console.log(Error)
      this.redirectToLogin()
      return null;
    }
  }

  /** returns the auth token stored in localStorage */
  getAuthTokenRaw(): string {
    return this.getJWTTokenRaw('api_token');
  }

  /** returns the refresh token stored in localStorage */
  getRefreshTokenRaw(): string {
    return this.getJWTTokenRaw('api_refresh_token');
  }

  getJWTTokenRaw(key: string): string {
    if(this.checkIfTokenExists(key)){
      return localStorage.getItem(key)!;
    }else{
      throwError("No refresh token found")
      return ""
    }
  }

  checkIfTokenExists(key : string){
    const token = localStorage.getItem(key);
    return !(token == null || token.split('.').length !== 3);
  }

  private getTokenExpirationDate(token: any) {
    let decoded = this.getDecodedAccessToken(token);

    if (typeof decoded.exp === "undefined")
      return null;

    return new Date(0).setUTCSeconds(decoded.exp);
  };

  isTokenExpired(token: any) {
    let d = this.getTokenExpirationDate(token);
    if (d === null) return false;
    // Token expired?
    return !(d.valueOf() > (new Date().valueOf()));
  };
}

