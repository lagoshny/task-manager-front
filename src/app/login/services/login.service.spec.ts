import { TestBed } from '@angular/core/testing';
import { User } from '../../core/models/user.model';
import { LoginService } from './login.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServerApi } from '../../app.config';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        LoginService
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should set auth header when get user information', () => {
    service = TestBed.inject(LoginService);
    const authUser = new User();
    authUser.username = 'test';
    authUser.password = '123456';
    service.login(authUser).subscribe();
    const req = httpMock.expectOne(ServerApi.LOGIN.path);

    const authHeaderValue = 'Basic ' + btoa(authUser.username + ':' + authUser.password);

    expect(req.request.method).toBe('POST');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(authHeaderValue);
    req.flush({});
  });

});
