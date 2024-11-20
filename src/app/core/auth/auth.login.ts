import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/service.authentication';
import { Observable, of } from 'rxjs';
import { Role } from '../constant/constant.role';
import { map, catchError, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthenticationService) { }

    canActivate(): Observable<boolean> {
        const token = localStorage.getItem('access_token');
        if (!token) {
            return of(true);
        }

        return this.authService.fetchUser().pipe(
            take(1),
            map(user => {
                if (user?.data.roles.includes('Teacher')) {
                    this.router.navigate(['/teacher']);
                    return false;
                }

                return false;
            }),
            catchError(error => {
                console.error('Error fetching user:', error);
                return of(true);
            })
        );
    }
}