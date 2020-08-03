import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userCredentials = this.authService.getCredentials();
    if (userCredentials) {
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${ userCredentials }`
        }
      });
    }

    return next.handle(request);
  }
}
