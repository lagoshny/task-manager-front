import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { provideNgxValidationMessagesTesting } from '@lagoshny/ngx-validation-messages';
import { Mocked } from 'vitest';

describe('UserFormComponent', () => {
  let fixture: ComponentFixture<UserFromComponent>;
  let comp: UserFromComponent;
  let routerSpy: Mocked<Pick<Router, 'navigate'>>;
  let authServiceSpy: Mocked<Pick<AuthService, 'getUser' | 'setUser'>>;
  let userServiceSpy: Mocked<Pick<UserService, 'patchResource' | 'getResource'>>;

  beforeEach(async () => {
    routerSpy = { navigate: vi.fn() };
    authServiceSpy = {
      getUser: vi.fn(),
      setUser: vi.fn(),
    };
    userServiceSpy = {
      patchResource: vi.fn(),
      getResource: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        UserFromComponent,
      ],
      providers: [
        provideNgxValidationMessagesTesting(),
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFromComponent);
    comp = fixture.componentInstance;
  });

  it('should load user when create component', () => {
    const user = new User();
    user.id = 1;

    authServiceSpy.getUser.mockReturnValue(user);
    userServiceSpy.getResource.mockReturnValue(of(user));

    fixture.detectChanges();

    expect(userServiceSpy.getResource).toHaveBeenCalledWith(1);
  });

  it('should update user in local storage after change', () => {
    const user = new User();
    user.id = 1;

    authServiceSpy.getUser.mockReturnValue(user);
    userServiceSpy.getResource.mockReturnValue(of(user));
    userServiceSpy.patchResource.mockReturnValue(of(user));
    routerSpy.navigate.mockResolvedValue(true);

    fixture.detectChanges();

    comp.saveUser();

    expect(authServiceSpy.setUser).toHaveBeenCalledWith(user);
  });

  it('should navigate to home page after save', () => {
    const user = new User();
    user.id = 1;

    authServiceSpy.getUser.mockReturnValue(user);
    userServiceSpy.getResource.mockReturnValue(of(user));
    userServiceSpy.patchResource.mockReturnValue(of(user));
    routerSpy.navigate.mockResolvedValue(true);

    fixture.detectChanges();

    comp.saveUser();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
  });
});
