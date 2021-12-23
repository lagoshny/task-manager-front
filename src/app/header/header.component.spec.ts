import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { User } from '../core/models/user.model';
import { AuthService } from '../core/services/auth.service';
import { HeaderComponent } from './header.component';
import { LoggerTestingModule } from 'ngx-logger/testing';

@Component({
  selector: 'tm-menu',
  template: ''
})
class MenuStubComponent {
}

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let comp: HeaderComponent;
  let routerSpy: any;
  let authServiceSpy: any;

  beforeEach(async(() => {
    routerSpy = {
      navigate: jasmine.createSpy('navigate')
    };
    authServiceSpy = {
      getUser: jasmine.createSpy('getUser'),
      logOut: jasmine.createSpy('logOut')
    };

    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule
      ],
      declarations: [
        MenuStubComponent,
        HeaderComponent
      ],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: AuthService, useValue: authServiceSpy}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('when user logged in userName should be eq auth username ', () => {
    const authUser = new User();
    authUser.username = 'Test';
    authServiceSpy.getUser.and.returnValue(authUser);

    fixture.detectChanges();

    expect(comp.userName).toBe(authUser.username);
  });

  it('should navigate to login page after logout', () => {
    authServiceSpy.getUser.and.returnValue(new User());
    fixture.detectChanges();
    routerSpy.navigate.and.returnValue(Promise.resolve());

    comp.logout();

    expect(routerSpy.navigate.calls.count()).toBe(1);
    expect(routerSpy.navigate.calls.first().args[0]).toEqual(['/login']);
  });

});
