import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NgxValidationMessagesModule } from '@lagoshny/ngx-validation-messages';
import { NGXLogger, NGXLoggerMock } from 'ngx-logger';
import { of } from 'rxjs';
import { CoreModule } from '../../../core/core.module';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../services/user.service';
import { UserFromComponent } from './user-from.component';


describe('UserFormComponent', () => {
  let fixture: ComponentFixture<UserFromComponent>;
  let comp: UserFromComponent;
  let routerSpy: any;
  let authServiceSpy: any;
  let userServiceSpy: any;

  beforeEach(async(() => {
    routerSpy = {
      navigate: jasmine.createSpy('navigate')
    };
    authServiceSpy = {
      getUser: jasmine.createSpy('getUser'),
      setUser: jasmine.createSpy('setUser')
    };
    userServiceSpy = {
      patch: jasmine.createSpy('patch'),
      get: jasmine.createSpy('get')
    };

    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatMomentDateModule,
        MatDatepickerModule,
        NgxValidationMessagesModule.forRoot({
          messages: {}
        })
      ],
      declarations: [
        UserFromComponent
      ],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: NGXLogger, useClass: NGXLoggerMock},
        {provide: AuthService, useValue: authServiceSpy},
        {provide: UserService, useValue: userServiceSpy}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UserFromComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should load user when create component', () => {
    authServiceSpy.getUser.and.returnValue(new User());
    userServiceSpy.get.and.returnValue(of(new User()));

    fixture.detectChanges();

    expect(userServiceSpy.get.calls.count()).toBe(1);
  });

  it('should update user in local storage after change', () => {
    authServiceSpy.getUser.and.returnValue(new User());
    userServiceSpy.get.and.returnValue(of(new User()));
    fixture.detectChanges();
    userServiceSpy.patch.and.returnValue(of(new User()));
    routerSpy.navigate.and.returnValue(Promise.resolve());

    comp.saveUser();

    expect(authServiceSpy.setUser.calls.count()).toBe(1);
  });

  it('should navigate to home page after save', () => {
    authServiceSpy.getUser.and.returnValue(new User());
    userServiceSpy.get.and.returnValue(of(new User()));
    fixture.detectChanges();
    userServiceSpy.patch.and.returnValue(of(new User()));
    routerSpy.navigate.and.returnValue(Promise.resolve());

    comp.saveUser();

    expect(routerSpy.navigate.calls.count()).toBe(1);
    expect(routerSpy.navigate.calls.first().args[0]).toEqual(['home']);
  });

});
