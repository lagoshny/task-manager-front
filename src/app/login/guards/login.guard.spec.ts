import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { loginGuard } from './login.guard';

describe('LoginService', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });
  });

  it('should pass to home page if already logged in', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    TestBed.runInInjectionContext(() => {
      loginGuard(null as any, null as any);
    });

    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should return false if already logged in', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    const result = TestBed.runInInjectionContext(() =>
      loginGuard(null as any, null as any)
    );

    expect(result).toBeFalse();
  });

  it('should return true if user is not logged in', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      loginGuard(null as any, null as any)
    );

    expect(result).toBeTrue();
  });
});
