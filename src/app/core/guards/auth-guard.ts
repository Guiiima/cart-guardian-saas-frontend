import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

/**
 * Este guarda verifica se um utilizador está autenticado (no modo standalone)
 * antes de permitir o acesso a uma rota.
 */
export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  
  const authService = inject(AuthService);
  const router = inject(Router);


  if (authService.isAuthenticated()) {
    return true; 
  }


  console.warn('Acesso não autorizado. A redirecionar para /login...');
  return router.createUrlTree(['/login']);
};