import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { catchError, Observable, switchMap, take, throwError } from 'rxjs';
import { environments } from '../../../environments/environment.development';
import { AuthenticationService } from '../services/service.authentication';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService = inject(AuthenticationService);

  const accessToken = authenticationService.getAccessToken();
  // console.log('>>>is logged', accessToken);
  const isApiUrl = req.url.startsWith(environments.apiUrl);

  if (accessToken && isApiUrl) {
    // console.log('Adding token to request:', accessToken);
    req = addToken(req, accessToken);
  }

  return next(req).pipe(
    catchError((error) => {
      console.log('Error status:', error.status);
      console.log('Requested URL:', req.url);
      if (error.status === 401 && isApiUrl && !req.url.includes('login') && !req.url.includes('refresh') && accessToken) {
        return handle401Error(req, next, authenticationService);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn, authenticationService: AuthenticationService): Observable<HttpEvent<unknown>> {
  const currentAccessToken: string = authenticationService.getAccessToken()!;
  // if (req.url.includes('refresh')) {
  //   console.log("Refresh token request failed, logging out.");
  //   authenticationService.logout();
  //   return throwError(() => new Error("Failed to refresh token. Logging out."));
  // }
  return authenticationService.refreshToken(currentAccessToken).pipe(
    take(1),
    switchMap((token: IToken) => {
      localStorage.setItem('access_token', token.access_Token);
      return next(addToken(req, token.access_Token));
    }),
    catchError((err) => {
      // authenticationService.logout();
      console.log('>>>err.status', err.status);
      return throwError(() => err);
    })
  );
}
function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}