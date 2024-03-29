import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UserService } from '../modules/auth/user.service';
import { NotificationService } from '../modules/notification/notification.service';
import { environment } from '../../../environments/environment';
import { WINDOW } from '../modules/helper/window.providers';
import { NotificationType } from '../../root/interfaces/notification';

@Injectable()
export class RestService {
    constructor(
        public http: HttpClient,
        public userService: UserService,
        private notificationService: NotificationService,
        @Inject(WINDOW) private window: Window,
    ) {}

    baseURL = environment.apiUrl;

    requestOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };
    private doRequest<T>(request: Observable<T>): Observable<T> {
        if (this.userService.isLoggedIn()) {
            return request;
        } else {
            if (this.userService.canRefresh()) {
                return this.userService.renewToken().pipe(mergeMap(() => request));
            } else {
                this.userService.redirectToLogin();
                return throwError('Session expired!');
            }
        }
    }

    public doGETRequest<T>(url: string): Observable<T> {
        const request = this.http.get(this.baseURL + url, this.requestOptions).pipe(
            map((res: any) => {
                if (typeof res === 'string') {
                    return JSON.parse(res);
                }
                return res;
            }),
            catchError((error) => {
                this.notificationService.notify(NotificationType.error, error.error);
                return throwError(error || 'Server error');
            }),
        );
        return this.doRequest(request);
    }

    public doDELRequest<T>(url: string): Observable<T> {
        const requestOptions = {
            headers: this.requestOptions.headers,
        };
        const request = this.http.delete(this.baseURL + url, requestOptions).pipe(
            map((res: any) => {
                if (res == null) {
                    throwError('no data');
                } else if (typeof res === 'string') {
                    return JSON.parse(res);
                } else {
                    return res;
                }
            }),
            catchError((error) => {
                this.notificationService.notify(NotificationType.error, error.error.message);
                return throwError(error || 'Server error');
            }),
        );
        return this.doRequest(request);
    }

    public doPOSTRequest<T>(url: string, object: any): Observable<T> {
        const request = this.http.post(this.baseURL + url, object, this.requestOptions).pipe(
            map((res: any) => {
                if (res == null) {
                    throwError('no data');
                    return null;
                } else if (typeof res === 'string') {
                    return JSON.parse(res);
                } else {
                    return res;
                }
            }),
            catchError((error) => {
                this.notificationService.notify(NotificationType.error, error.error.message);
                return throwError(error || 'Server error');
            }),
        );
        return this.doRequest(request);
    }

    public doPUTRequest<T>(url: string, object: any): Observable<T> {
        const request = this.http.put<T>(this.baseURL + url, object, this.requestOptions).pipe(
            catchError((error) => {
                this.notificationService.notify(NotificationType.error, error.error.message);
                return throwError(error || 'Server error');
            }),
        );
        return this.doRequest(request);
    }

    public doPOSTPublicRequest<T>(url: string, object: any): Observable<T> {
        return this.http.post(this.baseURL + url, object, this.requestOptions).pipe(
            map((res: any) => {
                if (res == null) {
                    throwError('no data');
                    return null;
                } else if (typeof res === 'string') {
                    return JSON.parse(res);
                } else {
                    return res;
                }
            }),
            catchError((error) => {
                this.notificationService.notify(NotificationType.error, error.error.message);
                return throwError(error || 'Server error');
            }),
        );
    }

    public doPUTPublicRequest<T>(url: string, object: any): Observable<T> {
        return this.http.put<T>(this.baseURL + url, object, this.requestOptions).pipe(
            catchError((error) => {
                this.notificationService.notify(NotificationType.error, error.error.message);
                return throwError(error || 'Server error');
            }),
        );
    }
}
