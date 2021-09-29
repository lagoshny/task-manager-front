import { Injectable } from '@angular/core';
import { HateoasResourceOperation } from '@lagoshny/ngx-hateoas-client';
import { User } from '../../core/models/user.model';

@Injectable()
export class UserService extends HateoasResourceOperation<User> {

  constructor() {
    super(User);
  }

}
