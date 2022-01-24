import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from "@angular/router";
import {UserService} from "../modules/auth/user.service";

@Injectable()
export class CommonInterceptor implements HttpInterceptor {

  _router: any = null;

  constructor(private injector: Injector,
              private userService: UserService) {
    setTimeout(() => this._router = injector.get(Router))
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("I am the Interceptor")
    console.log(request.url)

    if (this.userService.isLoggedIn()) {
      request = this.addToken(request, this.userService.getAuthTokenRaw())
    }

    return next.handle(request.clone())
  }

  addToken(request: HttpRequest<any>, authTokenRaw: string) {
    return request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + authTokenRaw
      }
    });
  }

}
