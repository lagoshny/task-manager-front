import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CoreModule } from '../../../core/core.module';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../services/user.service';
import { UserFromComponent } from './user-from.component';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { provideNgxValidationMessages } from '@lagoshny/ngx-validation-messages';


describe('UserFormComponent', () => {
  let fixture: ComponentFixture<UserFromComponent>;
  let comp: UserFromComponent;
  let routerSpy: any;
  let authServiceSpy: any;
  let userServiceSpy: any;

  beforeEach(waitForAsync(() => {
    routerSpy = {
      navigate: jasmine.createSpy('navigate')
    };
    authServiceSpy = {
      getUser: jasmine.createSpy('getUser'),
      setUser: jasmine.createSpy('setUser')
    };
    userServiceSpy = {
      patchResource: jasmine.createSpy('patchResource'),
      getResource: jasmine.createSpy('getResource')
    };

    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatMomentDateModule,
        MatDatepickerModule,
        LoggerTestingModule,
      ],
      declarations: [
        UserFromComponent
      ],
      providers: [
        provideNgxValidationMessages({
          messages: {}
        }),
        {provide: Router, useValue: routerSpy},
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
    userServiceSpy.getResource.and.returnValue(of(new User()));

    fixture.detectChanges();

    expect(userServiceSpy.getResource.calls.count()).toBe(1);
  });

  it('should update user in local storage after change', () => {
    authServiceSpy.getUser.and.returnValue(new User());
    userServiceSpy.getResource.and.returnValue(of(new User()));
    fixture.detectChanges();
    userServiceSpy.patchResource.and.returnValue(of(new User()));
    routerSpy.navigate.and.returnValue(Promise.resolve());

    comp.saveUser();

    expect(authServiceSpy.setUser.calls.count()).toBe(1);
  });

  it('should navigate to home page after save', () => {
    authServiceSpy.getUser.and.returnValue(new User());
    userServiceSpy.getResource.and.returnValue(of(new User()));
    fixture.detectChanges();
    userServiceSpy.patchResource.and.returnValue(of(new User()));
    routerSpy.navigate.and.returnValue(Promise.resolve());

    comp.saveUser();

    expect(routerSpy.navigate.calls.count()).toBe(1);
    expect(routerSpy.navigate.calls.first().args[0]).toEqual(['home']);
  });

});
