import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginGuard } from './login.guard';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('LoginService', () => {
  let guard: LoginGuard;

  let routerSpy: any;
  let authServiceSpy: any;

  beforeEach(() => {
    routerSpy = {
      navigate: jasmine.createSpy('navigate')
    };
    authServiceSpy = {
      isAuthenticated: jasmine.createSpy('isAuthenticated')
    };
    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule
      ],
      providers: [
        LoginGuard,
        {provide: Router, useValue: routerSpy},
        {provide: AuthService, useValue: authServiceSpy}
      ]
    });
  });

  it('should pass to home page if already logged in', () => {
    guard = TestBed.inject(LoginGuard);
    authServiceSpy.isAuthenticated.and.returnValue(true);
    routerSpy.navigate.and.returnValue(Promise.resolve());

    guard.canActivate(null, null);

    expect(routerSpy.navigate.calls.count()).toBe(1);
    expect(routerSpy.navigate.calls.first().args[0]).toEqual(['home']);
  });

  it('should return false if already logged in', () => {
    guard = TestBed.inject(LoginGuard);
    authServiceSpy.isAuthenticated.and.returnValue(true);
    routerSpy.navigate.and.returnValue(Promise.resolve());

    const result = guard.canActivate(null, null);

    expect(result).toBeFalsy();
  });

  it('should return true if user is not logged in', () => {
    guard = TestBed.inject(LoginGuard);
    authServiceSpy.isAuthenticated.and.returnValue(false);
    routerSpy.navigate.and.returnValue(Promise.resolve());

    const result = guard.canActivate(null, null);

    expect(result).toBeTruthy();
  });

});
