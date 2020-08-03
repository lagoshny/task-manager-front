import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from '../../core/services/auth.service';

/**
 * Login form guard that checks user authentication and if a user has authentication
 * it redirects his to the home page, does nothing otherwise.
 */
@Injectable()
export class LoginGuard implements CanActivate {

  constructor(private router: Router,
              private logger: NGXLogger,
              private authService: AuthService) {
  }

  public canActivate(route: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['home']).catch(reason => {
        this.logger.error(reason);
      });
      return false;
    }

    return true;
  }

}
