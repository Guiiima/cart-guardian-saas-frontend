import { ApplicationConfig, provideZoneChangeDetection, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
import { ShopifyAuthService } from '@core/services/shopifyAuth';

export function initializeShopifyAuth(): Promise<void> {
  const shopifyAuthService = inject(ShopifyAuthService);
  return shopifyAuthService.whenReady();
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


