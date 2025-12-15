import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { loginGuard } from './login.guard';
import { Mocked, vi } from 'vitest';

describe('LoginService', () => {
  let routerSpy: Mocked<Pick<Router, 'navigate'>>;
  let authServiceSpy: Mocked<Pick<AuthService, 'isAuthenticated'>>;

  beforeEach(() => {
    routerSpy = {navigate: vi.fn()};
    authServiceSpy = { isAuthenticated: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });
  });

  it('should pass to home page if already logged in', () => {
    authServiceSpy.isAuthenticated.mockReturnValue(true);
    routerSpy.navigate.mockResolvedValue(true);

    TestBed.runInInjectionContext(() => {
      loginGuard(null as any, null as any);
    });

    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should return false if already logged in', () => {
    authServiceSpy.isAuthenticated.mockReturnValue(true);
    routerSpy.navigate.mockResolvedValue(true);

    const result = TestBed.runInInjectionContext(() =>
      loginGuard(null as any, null as any)
    );

    expect(result).toBe(false);
  });

  it('should return true if user is not logged in', () => {
    authServiceSpy.isAuthenticated.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      loginGuard(null as any, null as any)
    );

    expect(result).toBe(true);
  });
});
