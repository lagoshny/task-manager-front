import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { LoginService } from '../../services/login.service';
import { LoginFormComponent } from './login-form.component';
import { provideNgxValidationMessages } from '@lagoshny/ngx-validation-messages';
import { Mocked } from 'vitest';

describe('LoginFormComponent', () => {
  let fixture: ComponentFixture<LoginFormComponent>;
  let comp: LoginFormComponent;
  let routerSpy: Mocked<Pick<Router, 'navigate'>>;
  let loginServiceSpy: Mocked<Pick<LoginService, 'login'>>;
  let authServiceSpy: Mocked<Pick<AuthService, 'setCredentials' | 'setUser'>>;

  beforeEach(() => {
    routerSpy = {
      navigate: vi.fn()
    };
    loginServiceSpy = {
      login: vi.fn()
    };
    authServiceSpy = {
      setCredentials: vi.fn(),
      setUser: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        LoginFormComponent,
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
  });

  it('should save user credentials after success login', () => {
    const authUser = new User();
    authUser.username = 'test';
    authUser.password = '123456';
    comp.loginForm.patchValue(authUser);
    loginServiceSpy.login.mockReturnValue(of(new User()));
    routerSpy.navigate.mockReturnValue(Promise.resolve(true));

    comp.login();

    expect(authServiceSpy.setCredentials).toHaveBeenCalledOnce();
    const authUserCredentials = btoa(authUser.username + ':' + authUser.password);
    expect(authServiceSpy.setCredentials).toHaveBeenCalledWith(authUserCredentials);
  });

  it('should save user data after success login', () => {
    const authUser = new User();
    authUser.username = 'test';
    authUser.password = '123456';
    loginServiceSpy.login.mockReturnValue(of(authUser));
    routerSpy.navigate.mockReturnValue(Promise.resolve(true));

    comp.login();

    expect(authServiceSpy.setUser).toHaveBeenCalledOnce();
    expect(authServiceSpy.setUser).toHaveBeenCalledWith(authUser);
  });

  it('should navigate to home page after success login', () => {
    loginServiceSpy.login.mockReturnValue(of(new User()));
    routerSpy.navigate.mockReturnValue(Promise.resolve(true));

    comp.login();

    expect(routerSpy.navigate).toHaveBeenCalledOnce();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
  });

});
