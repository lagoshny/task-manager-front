import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { NgxValidationMessagesModule } from '@lagoshny/ngx-validation-messages';
import { NGXLogger, NGXLoggerMock } from 'ngx-logger';
import { of } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../users/services/user.service';
import { RegistrationFormComponent } from './registration-form.component';

describe('RegistrationFormComponent', () => {
  let fixture: ComponentFixture<RegistrationFormComponent>;
  let comp: RegistrationFormComponent;
  let routerSpy: any;
  let userServiceSpy: any;
  let authServiceSpy: any;

  beforeEach(async(() => {
    routerSpy = {
      navigate: jasmine.createSpy('navigate')
    };
    userServiceSpy = {
      createResource: jasmine.createSpy('createResource')
    };
    authServiceSpy = {
      setCredentials: jasmine.createSpy('setCredentials'),
      setUser: jasmine.createSpy('setUser')
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatMomentDateModule,
        MatDatepickerModule,
        NgxValidationMessagesModule.forRoot({
          messages: {}
        })
      ],
      declarations: [
        RegistrationFormComponent
      ],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: NGXLogger, useClass: NGXLoggerMock},
        {provide: UserService, useValue: userServiceSpy},
        {provide: AuthService, useValue: authServiceSpy}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RegistrationFormComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should navigate to login form after success registration', () => {
    userServiceSpy.createResource.and.returnValue(of(new User()));
    routerSpy.navigate.and.returnValue(Promise.resolve());

    comp.sendForm();

    expect(routerSpy.navigate.calls.count()).toBe(1);
    expect(routerSpy.navigate.calls.first().args[0]).toEqual(['login']);
  });

});

