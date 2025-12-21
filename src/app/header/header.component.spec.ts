import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { HeaderComponent } from './header.component';
import { User } from '../core/models/user.model';
import { Mocked } from 'vitest';

@Component({
  selector: 'tm-menu',
  template: '',
  standalone: true
})
class MenuStubComponent {}

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let comp: HeaderComponent;
  let authServiceSpy: Mocked<Pick<AuthService, 'getUser' | 'logOut'>>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = {
      getUser: vi.fn(),
      logOut: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        MenuStubComponent,
      ],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    comp = fixture.componentInstance;
    router = TestBed.inject(Router);

    vi.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
  });

  it('when user logged in userName should be eq auth username ', () => {
    const authUser = new User();
    authUser.username = 'Test';
    authServiceSpy.getUser.mockReturnValue(authUser);

    fixture.detectChanges();

    expect(comp.userName).toBe(authUser.username);
  });

  it('should navigate to login page after logout', () => {
    authServiceSpy.getUser.mockReturnValue(new User());
    fixture.detectChanges();

    comp.logout();

    expect(authServiceSpy.logOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
