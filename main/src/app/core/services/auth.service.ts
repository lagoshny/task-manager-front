import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {

    public getUser(): User {
        let fakeUser = new User();
        fakeUser._links = {
            self: {
                href: 'http://localhost:8080/api/v1/users/1'
            }
        };

        return fakeUser;
    }

}
