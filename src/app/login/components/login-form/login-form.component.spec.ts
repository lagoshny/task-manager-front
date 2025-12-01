import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { LoginService } from '../../services/login.service';
import { LoginFormComponent } from './login-form.component';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { provideNgxValidationMessages } from '@lagoshny/ngx-validation-messages';

describe('LoginFormComponent', () => {
  let fixture: ComponentFixture<LoginFormComponent>;
  let comp: LoginFormComponent;
  let routerSpy: any;
  let loginServiceSpy: any;
  let authServiceSpy: any;

  beforeEach(waitForAsync(() => {
    routerSpy = {
      navigate: jasmine.createSpy('navigate')
    };
    loginServiceSpy = {
      login: jasmine.createSpy('login')
    };
    authServiceSpy = {
      setCredentials: jasmine.createSpy('setCredentials'),
      setUser: jasmine.createSpy('setUser')
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        LoggerTestingModule,
      ],
      declarations: [
        LoginFormComponent
      ],
      providers: [
        provideNgxValidationMessages({
          messages: {}
        }),
        {provide: Router, useValue: routerSpy},
        {provide: LoginService, useValue: loginServiceSpy},
        {provide: AuthService, useValue: authServiceSpy}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LoginFormComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should save user credentials after success login', () => {
    const authUser = new User();
    authUser.username = 'test';
    authUser.password = '123456';
    comp.loginForm.patchValue(authUser);
    loginServiceSpy.login.and.returnValue(of(new User()));
    routerSpy.navigate.and.returnValue(Promise.resolve());

    comp.login();

    expect(authServiceSpy.setCredentials.calls.count()).toBe(1);
    const authUserCredentials = btoa(authUser.username + ':' + authUser.password);
    expect(authServiceSpy.setCredentials.calls.first().args[0]).toBe(authUserCredentials);
  });

  it('should save user data after success login', () => {
    const authUser = new User();
    authUser.username = 'test';
    authUser.password = '123456';
    loginServiceSpy.login.and.returnValue(of(authUser));
    routerSpy.navigate.and.returnValue(Promise.resolve());

    comp.login();

    expect(authServiceSpy.setUser.calls.count()).toBe(1);
    expect(authServiceSpy.setUser.calls.first().args[0]).toBe(authUser);
  });

  it('should navigate to home page after success login', () => {
    loginServiceSpy.login.and.returnValue(of(new User()));
    routerSpy.navigate.and.returnValue(Promise.resolve());

    comp.login();

    expect(routerSpy.navigate.calls.count()).toBe(1);
    expect(routerSpy.navigate.calls.first().args[0]).toEqual(['home']);
  });

});
