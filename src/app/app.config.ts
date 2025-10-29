import { ApplicationConfig, provideZoneChangeDetection, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
import { ApiService } from '@core/services/ApiService';

export function initializeShopifyAuth(): Promise<void> {
  const apiService = inject(ApiService);
  return apiService.whenReady();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAppInitializer(initializeShopifyAuth),
  ],
};


