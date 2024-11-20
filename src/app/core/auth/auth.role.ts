import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/service.authentication';
import { Role } from '../constant/constant.role';
import { catchError, map, Observable, of, tap } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    user: IUser | null = null;
    constructor(private authService: AuthenticationService, private router: Router,
        private authenService: AuthenticationService
    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const expectedRole = route.data['expectedRole'] as Role[] | undefined;
        // this.authService.resetUser();
        return this.authService.fetchUser().pipe(
            map(user => {
                if (user && expectedRole) {
                    const userRoles = user.data.roles!;
                    console.log('User roles:', user);
                    const hasRole = userRoles.some(role => expectedRole.includes(role as Role));
                    if (hasRole) {
                        return true
                    }
                }
                this.router.navigate(['/error']);
                return false
            }),
            catchError((error) => {
                console.error('Fetch user error:', error);
                this.router.navigate(['/error']);
                return of(false);
            })
        )

    }
}
