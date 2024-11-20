import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import { AuthenticationService } from '../../services/service.authentication';
import {
    loadUser,
    loadUserSuccess,
    loadUserFailure,
    updateUser,
    updateUserSuccess,
    updateUserFailure
} from './user.data.action';
import { catchError, delay, map, mergeMap, of, switchMap } from 'rxjs';
import { CommonService } from '../../services/common/service.common';

@Injectable()
export class UserEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthenticationService,
        private commonService: CommonService
    ) { }

    loadUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadUser),
            switchMap(() =>
                this.authService.fetchUser().pipe(
                    map(user => {
                        if (user) {
                            console.log('>>> user state', user)
                            return loadUserSuccess({ user });
                        } else {
                            return loadUserFailure({ error: 'User not found' });
                        }
                    }),
                    catchError(error => of(loadUserFailure({ error: error.message })))
                )
            )
        )
    );

    updateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateUser),
            switchMap(({ user }) =>
                this.commonService.updateUser(user).pipe(
                    switchMap(() =>
                        this.authService.fetchUser().pipe(
                            delay(500), // 0.5s delay
                            map(freshUser => {
                                if (freshUser) {
                                    return loadUserSuccess({ user: freshUser });
                                } else {
                                    return loadUserFailure({ error: 'User not found after update' });
                                }
                            }),
                            catchError(error => of(loadUserFailure({ error: error.message })))
                        )
                    ),
                    catchError(error => of(updateUserFailure({ error: error.message })))
                )
            )
        )
    );



}
