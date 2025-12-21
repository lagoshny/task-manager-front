import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// import { NGXLogger } from 'ngx-logger';
import { AuthService } from '../../core/services/auth.service';

/**
 * Login form guard that checks user authentication and if a user has authentication
 * it redirects his to the home page, does nothing otherwise.
 */
export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // const logger = inject(NGXLogger);

  if (authService.isAuthenticated()) {
    router.navigate(['home']);
    return false;
  }

  return true;
};
