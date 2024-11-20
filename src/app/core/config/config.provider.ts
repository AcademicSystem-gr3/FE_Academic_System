import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withJsonpSupport } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { appConfig } from '../../app.config';
import { customInterceptor } from '../auth/custome.interceptor';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { provideStore } from '@ngrx/store';
import { userReducer } from '../states/user.login.data.ts/user.data.reducer';
import { provideEffects } from '@ngrx/effects';
import { UserEffects } from '../states/user.login.data.ts/user.data.effect';



const antDesignIcons = AllIcons as {
    [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

export const appProviders = [
    ...appConfig.providers,
    provideHttpClient(withJsonpSupport(), withInterceptors([customInterceptor])),
    {
        provide: 'SocialAuthServiceConfig',
        useValue: {
            autoLogin: false,
            providers: [
                {
                    id: GoogleLoginProvider.PROVIDER_ID,
                    provider: new GoogleLoginProvider('571984643788-r28k3ecsrajdebppuj21daqebo3hqj2e.apps.googleusercontent.com', {
                        oneTapEnabled: false,
                        prompt: 'consent'
                    }),
                },
            ],
        } as SocialAuthServiceConfig,
    },
    provideAnimations(),
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons }
];
