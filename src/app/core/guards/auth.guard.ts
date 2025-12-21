import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Application auth guard checks that the user has authentication or redirects to the login form.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // const logger = inject(NGXLogger);

  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['login']);
    // .catch(reason => logger.error(reason));

  return false;
};
