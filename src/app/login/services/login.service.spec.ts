import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { User } from '../../core/models/user.model';
import { LoginService } from './login.service';

describe('LoginService', () => {
    let service: LoginService;

    let httpClientSpy: any;

    beforeEach(() => {
        httpClientSpy = {
            post: jasmine.createSpy('post')
        };
        TestBed.configureTestingModule({
            providers: [
                {provide: HttpClient, useValue: httpClientSpy},
                LoginService
            ]
        });
    });

    it('should set auth header when get user information', () => {
        service = TestBed.get(LoginService);
        const authUser = new User();
        authUser.username = 'test';
        authUser.password = '123456';
        service.login(authUser);

        const authHeaderValue = 'Basic ' + btoa(authUser.username + ':' + authUser.password);
        expect(httpClientSpy.post.calls.count()).toBe(1);
        expect(httpClientSpy.post.calls.first().args[2].headers.has('Authorization')).toBeTruthy();
        expect(httpClientSpy.post.calls.first().args[2].headers.get('Authorization')).toEqual(authHeaderValue);
    });

});
