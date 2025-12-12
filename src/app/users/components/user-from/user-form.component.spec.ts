import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../services/user.service';
import { UserFromComponent } from './user-from.component';
import { provideNgxValidationMessages } from '@lagoshny/ngx-validation-messages';

describe('UserFormComponent', () => {
  let fixture: ComponentFixture<UserFromComponent>;
  let comp: UserFromComponent;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(waitForAsync(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser', 'setUser']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['patchResource', 'getResource']);

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        UserFromComponent,
      ],
      providers: [
        provideNgxValidationMessages({ messages: {} }),
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFromComponent);
    comp = fixture.componentInstance;
  });

  it('should load user when create component', () => {
    const user = new User();
    user.id = 1;

    authServiceSpy.getUser.and.returnValue(user);
    userServiceSpy.getResource.and.returnValue(of(user));

    fixture.detectChanges();

    expect(userServiceSpy.getResource).toHaveBeenCalledWith(1);
  });

  it('should update user in local storage after change', () => {
    const user = new User();
    user.id = 1;

    authServiceSpy.getUser.and.returnValue(user);
    userServiceSpy.getResource.and.returnValue(of(user));
    userServiceSpy.patchResource.and.returnValue(of(user));
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    fixture.detectChanges();

    comp.saveUser();

    expect(authServiceSpy.setUser).toHaveBeenCalledWith(user);
  });

  it('should navigate to home page after save', () => {
    const user = new User();
    user.id = 1;

    authServiceSpy.getUser.and.returnValue(user);
    userServiceSpy.getResource.and.returnValue(of(user));
    userServiceSpy.patchResource.and.returnValue(of(user));
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    fixture.detectChanges();

    comp.saveUser();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
  });
});
