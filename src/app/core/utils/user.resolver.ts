import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

import { catchError, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../services/service.authentication';
import { error } from '@ant-design/icons-angular';

@Injectable({
    providedIn: 'root',
})
export class UserResolver implements Resolve<IUser | null> {
    constructor(private authService: AuthenticationService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUser | null> {
        const accessToken = this.authService.getAccessToken();
        const refreshToken = this.authService.getRefreshToken();
        // Return the observable directly, no need to subscribe here

        return this.authService.fetchUser().pipe(
            catchError((error) => {
                console.error('Fetch user error:', error);

                // Kiểm tra mã lỗi
                if (error.status === 401) {
                    if (accessToken && refreshToken) {
                        return this.authService.refreshToken(accessToken, refreshToken).pipe(
                            switchMap(() => {

                                return this.authService.fetchUser().pipe(
                                    catchError(() => {

                                        this.router.navigate(['/login']);
                                        return of(null);
                                    })
                                );
                            }),
                            catchError(() => {
                                // Nếu refresh token cũng gặp lỗi, điều hướng đến trang đăng nhập
                                this.router.navigate(['/login']);
                                return of(null);
                            })
                        );
                    } else {
                        // Nếu không có refresh token, điều hướng đến trang đăng nhập
                        this.router.navigate(['/login']);
                        return of(null);
                    }
                } else {
                    // Nếu không phải là lỗi 401, điều hướng đến trang đăng nhập
                    this.router.navigate(['/login']);
                    return of(null);
                }
            })
        );
    }
}
