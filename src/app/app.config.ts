import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { FormsModule } from '@angular/forms';

import { providePrimeNG } from 'primeng/config';
// import { Lara } from '@primeng/themes/lara';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom(FormsModule),
    // providePrimeNG({
    //   theme: {
    //     preset: Lara,
    //   },
    // }),
  ],
};
