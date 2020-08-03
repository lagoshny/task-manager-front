import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Application auth guard checks that the user has authentication or redirects to the login form.
 */
@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private router: Router,
              private authService: AuthService,
              private logger: NGXLogger) {
  }

  public canActivate(route: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['login']).catch(reason => this.logger.error(reason));

    return false;
  }

}
