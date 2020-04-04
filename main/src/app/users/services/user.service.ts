import { Injectable, Injector } from '@angular/core';
import { RestService } from '@lagoshny/ngx-hal-client';
import { ServerApi } from '../../app.config';
import { User } from '../../core/models/user.model';

@Injectable()
export class UserService extends RestService<User> {

    constructor(injector: Injector) {
        super(User, ServerApi.USERS.resource, injector);
    }

}
