import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appProviders } from './app/core/config/config.provider';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';


bootstrapApplication(AppComponent, {
    providers: appProviders,
}).catch(err => console.error(err));
