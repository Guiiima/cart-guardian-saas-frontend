import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  const isInsideIframe = window.self !== window.top;
  
  if (isInsideIframe) {
    return true;
  }

  console.warn('Acesso não autorizado (standalone). A redirecionar para /login...');
  return router.createUrlTree(['/login']);
};
