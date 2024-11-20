import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environments } from '../../../environments/environment.development';
import { Store } from '@ngrx/store';
// import { AppState } from '../states/app.state';
import { error } from '@ant-design/icons-angular';
import { ServiceBaseService } from './service.base';
import { CookieService } from 'ngx-cookie-service';
import { IUserRegister } from '../states/user.register.data.ts/user.register.reducer';
import { SocialAuthService } from '@abacritt/angularx-social-login';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<IUser | null>;
    public user: Observable<IUser | null>;
    private user$: Observable<IUser | null> | null = null;
    constructor(
        private router: Router,
        private http: HttpClient,
        // private store: Store<AppState>,
        private sericeBase: ServiceBaseService,
        private cookieService: CookieService,
        private socialAuthService: SocialAuthService
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }
    getRefreshToken() {
        return this.cookieService.get('X-Refresh-Token')
    }
    getAccessToken() {
        return localStorage.getItem('access_token')
    }
    fetchUser(): Observable<IUser | null> {
        // if (!this.user$) {
        //     this.user$ = this.http.get<IUser>(`${environments.apiUrl}/api/auth/profile`).pipe(
        //         shareReplay(1),
        //         catchError(error => {
        //             console.error('Error fetching user:', error);
        //             return of(null);
        //         })
        //     );
        // }
        // return this.user$;
        return this.sericeBase.get<IUser>('/api/auth/profile');
    }
    clearUserCache() {
        this.user$ = null;  // Xóa giá trị cache
    }

    resetUser(): void {
        this.user$ = null;
    }
    login(provider?: string, userName?: string, password?: string, fullname?: string, avatar?: string, address?: string, idToken?: string) {
        return this.http.post<any>(`${environments.apiUrl}/api/auth`, { provider, userName, password, fullname, avatar, address, idToken }, { withCredentials: true })
            .pipe(map(user => {
                const access_token = user.data.accessToken

                localStorage.setItem('access_token', access_token)
                this.userSubject.next(user.data);
                console.log('>>>data', this.userSubject.value)
                return user;
            }));
    }
    refreshToken(accessToken: string) {
        return this.http.post<IToken>(`${environments.apiUrl}/api/auth/refresh`, { accessToken }, { withCredentials: true })
            .pipe(
                map(token => {
                    const access_token = token.access_Token
                    localStorage.setItem('access_token', access_token)
                    return token
                }),
                catchError((error) => {
                    if (error.status === 401 || error.status === 403) {
                        // this.logout();
                        console.log('het han refresh token')
                    }
                    return throwError(() => error)
                })
            )
    }
    resendOTP(email: string) {
        return this.sericeBase.post<IMessageOtp>(`/api/register/resend-otp`, { email });
    }
    verify(data: IRegisterUser) {
        return this.sericeBase.post<IMessageOtp>('/api/register/verify-otp', { ...data });
    }
    sendOTP(data: Omit<IRegisterUser, 'otp'>) {
        return this.sericeBase.post<any>('/api/register', { ...data })
    }
    verifyEmailResetPassword(email: string) {
        return this.sericeBase.post<any>('/api/password/verify', { email: email })
    }
    resetPassword(email: string, token: string, password: string) {
        return this.sericeBase.post<any>('/api/password/reset', { email, token, newPassword: password })
    }
    logout() {
        localStorage.removeItem('access_token');
        this.cookieService.delete('X-Refresh-Token');
        this.socialAuthService.signOut()
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }
}