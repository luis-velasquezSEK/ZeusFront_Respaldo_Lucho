import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS, HttpErrorResponse
} from '@angular/common/http';
import {BehaviorSubject, Observable, switchMap, take, throwError} from 'rxjs';
import {TokenService} from "@services/token.service";
import {catchError, filter} from "rxjs/operators";
import {AppService} from "@services/app.service";
import {SocialAuthService} from "angularx-social-login";
import {SweetAlertService} from "@services/utils/sweet-alert.service";
import {JwtHelperService} from "@auth0/angular-jwt";

const TOKEN_HEADER_KEY = 'Authorization';
const COOKIE='Cookie';

@Injectable()
export class GeneralInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private tokenService: TokenService,
              private appService: AppService,) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = request;
    const token = this.tokenService.getToken();
    if (token != null) {
      authReq = this.addTokenHeader(request, token);
    }
    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && !authReq.url.includes('auth/google') && error.status === 401) {
        return this.handle401Error(authReq, next);
      }
      return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this.tokenService.getRefreshToken();
      if (token)
        return this.appService.refreshToken(token).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.tokenService.setToken(token.accessToken);
            this.refreshTokenSubject.next(token.accessToken);
            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.appService.logout();
            return throwError(err);
          })
        );
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone(
      {
        headers:request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)
      });
  }
}

export const generalInterceptor = [{provide: HTTP_INTERCEPTORS, useClass: GeneralInterceptor, multi: true}];
