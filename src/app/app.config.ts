import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { userReducer } from './core/states/user.login.data.ts/user.data.reducer';
import { UserEffects } from './core/states/user.login.data.ts/user.data.effect';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { classReducer } from './core/states/teacher.class.data.ts/teacher.class.reducer';
import { TeacherClassEffects } from './core/states/teacher.class.data.ts/teacher.class.effect';
import {
  provideAngularQuery,
  provideTanStackQuery,
  QueryClient,
  withDevtools,
} from '@tanstack/angular-query-experimental'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(
      {
        user: userReducer,
        class: classReducer
      }
    ),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    provideEffects([UserEffects, TeacherClassEffects]),
    provideTanStackQuery(new QueryClient(), withDevtools())
  ]
};
