import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerApi } from '../../app.config';
import { User } from '../../core/models/user.model';

@Injectable()
export class LoginService {

    constructor(private httpClient: HttpClient) {
    }

    /**
     * Get server-side authentication.
     * Server response will contains user's information.
     *
     * @param user who wants to login
     */
    public login(user: User): Observable<User> {
        const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa(user.username + ':' + user.password) });
        return this.httpClient.post<User>(ServerApi.LOGIN.path, null,
            {
                headers
            });
    }

}
