import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../users/services/user.service';
import { RegistrationFormComponent } from './registration-form.component';
import { provideNgxValidationMessages } from '@lagoshny/ngx-validation-messages';
import { Mocked } from 'vitest';

describe('RegistrationFormComponent', () => {
  let fixture: ComponentFixture<RegistrationFormComponent>;
  let comp: RegistrationFormComponent;
  let routerSpy: Mocked<Pick<Router, 'navigate'>>;
  let userServiceSpy: Mocked<Pick<UserService, 'createResource'>>;
  let authServiceSpy: Mocked<Pick<AuthService, 'setCredentials' | 'setUser'>>;

  beforeEach(waitForAsync(() => {
    routerSpy = {
      navigate: vi.fn()
    };
    userServiceSpy = {
      createResource: vi.fn()
    };
    authServiceSpy = {
      setCredentials: vi.fn(),
      setUser: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        RegistrationFormComponent,
      ],
      providers: [
        provideNgxValidationMessages({
          messages: {}
        }),
        { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RegistrationFormComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should navigate to login form after success registration', () => {
    userServiceSpy.createResource.mockReturnValue(of(new User()));
    routerSpy.navigate.mockReturnValue(Promise.resolve(true));

    comp.sendForm();

    expect(routerSpy.navigate).toHaveBeenCalledOnce();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });

});

