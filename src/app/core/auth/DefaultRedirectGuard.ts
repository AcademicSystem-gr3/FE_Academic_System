import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/service.authentication';
import { Observable, of } from 'rxjs';
import { Role } from '../constant/constant.role';
import { map, catchError, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DefaultRedirectGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthenticationService) { }

    canActivate(): Observable<boolean> {
        const path = this.router.url;
        return this.authService.fetchUser().pipe(
            take(1),
            map(user => {
                if (path == '') {
                    if (user?.data.roles.includes('Teacher')) {
                        this.router.navigate(['/teacher']);
                        return false;
                    } else if (user?.data.roles.includes('Student')) {
                        this.router.navigate(['/student']);
                        return false;
                    } else if (user?.data.roles.includes('Admin')) {
                        this.router.navigate(['/parent']);
                        return false;
                    }

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