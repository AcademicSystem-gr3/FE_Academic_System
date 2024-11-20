import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, switchMap, take, throwError } from 'rxjs';
import { environments } from '../../../environments/environment.development';
import { AuthenticationService } from '../services/service.authentication';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isLoggedIn = this.authenticationService.getAccessToken();
    console.log('>>>is logged', isLoggedIn)
    const isApiUrl = request.url.startsWith(environments.apiUrl);
    if (isLoggedIn && isApiUrl) {
      console.log('Adding token to request:', isLoggedIn);
      request = this.addToken(request, isLoggedIn);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && isLoggedIn) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    const currentAccessToken: string = this.authenticationService.getAccessToken()!;

    return this.authenticationService.refreshToken(currentAccessToken).pipe(
      take(1),
      switchMap((token: IToken) => {
        return next.handle(this.addToken(request, token.access_Token));
      }),
      catchError((err) => {
        this.authenticationService.logout();
        return throwError(() => err);
      })
    );
  }
  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}