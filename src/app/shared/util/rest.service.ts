import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserService} from "../modules/auth/user.service";
import {environment} from "../../../environments/environment";
import {catchError, map, mergeMap} from "rxjs/operators";
import {Observable, throwError} from 'rxjs';
import {NotificationService, Type} from "../modules/notification/notification.service";

@Injectable()
export class RestService {


  constructor(
    public http: HttpClient,
    public userService: UserService,
    private notificationService: NotificationService) {
  }

  baseURL = environment.apiUrl;

  requestOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    })
  }

  requestOptionsFileUpload = {
    headers: new HttpHeaders({
      "Content-Type": "text/xml",
    }),
  }

  private doRequest<T>(request: Observable<T>): Observable<T> {
    if (this.userService.isLoggedIn()) {
      return request;
    } else {
      if (this.userService.canRefresh()) {
        return this.userService.renewToken().pipe(mergeMap(() => request))
      } else {
        this.userService.redirectToLogin();
        return throwError("Session expired!");
      }
    }
  }

  /** does a authed http get request to the given URL and returns type T */
  public doGETRequest<T>(url: string): Observable<T> {
    const request = this.http
      .get(this.baseURL + url, this.requestOptions).pipe(
        map((res: any) => {
          console.log(res)
          return res
          }
        ),
        catchError((error: any) => {
          // const errorMsg = JSON.parse(error._body);
          //   //this.notify.error("Error", errorMsg.error || errorMsg.message);
          //   //this.log.error("GET@" + url, error);
          return throwError(error || "Server error");
        })
      );
    return this.doRequest(request);
  }

  public doDELRequest<T>(url: string): Observable<T> {
    const requestOptions = {
      headers: this.requestOptions.headers,
    };
    const request = this.http
      .delete(this.baseURL + url, requestOptions).pipe(
        map((res: any) => {
            if (res == null) {
              throwError("null data")
            } else {
              return res
            }
          }
        ),
        catchError((error: any) => {
          console.log(error.error)
          this.notificationService.notify(Type.error, error.error.message);
          // this.notify.message(error.error,  "ERROR")
          // const errorMsg = JSON.parse(error._body);
          //this.notify.error("Error", errorMsg.error || errorMsg.message);
          // error.object = object; // add post object to error
          //this.log.error("DEL@" + url, error);
          return throwError(error || "Server error");
        }));
    return this.doRequest(request);
  }

  /** does a authed http post request to the given URL with payload and returns type T */
  public doPOSTRequest<T>(url: string, object: any): Observable<T> {
    const request = this.http
      .post(
        this.baseURL + url,
        object,
        // this.createCleanJSON(object),
        this.requestOptions
      ).pipe(
        map((res: any) => {
          if (res == null) {
            throwError("null data")
            return null
          } else {
            return res
          }
        }),
        catchError((error: any, _caught) => {
          //const errorMsg = JSON.parse(error._body);
          //this.notify.error("Error", errorMsg.error || errorMsg.message);
          error.object = object; // add post object to error
          //this.log.error("POST@" + url, error);
          return throwError(error || "Server error");
        }));
    return this.doRequest(request);
  }

  public doPUTRequest<T>(url: string, object: any): Observable<T> {
    const request = this.http
      .put<T>(
        this.baseURL + url,
        object,
        // this.createCleanJSON(object),
        this.requestOptions
      ).pipe(
        catchError((error: any) => {
          //const errorMsg = JSON.parse(error._body);
          //this.notify.error("Error", errorMsg.error || errorMsg.message);
          error.object = object; // add post object to error
          //this.log.error("PUT@" + url, error);
          return  throwError(error || "Server error");
        }));
    return this.doRequest(request);
  }
}
