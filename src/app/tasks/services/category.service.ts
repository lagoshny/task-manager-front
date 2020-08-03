import { Injectable, Injector } from '@angular/core';
import { RestService } from '@lagoshny/ngx-hal-client';
import { Observable } from 'rxjs';
import { ServerApi } from '../../app.config';
import { TaskCategory } from '../../core/models/task-category.model';
import { AuthService } from '../../core/services/auth.service';

@Injectable()
export class CategoryService extends RestService<TaskCategory> {

  constructor(private authService: AuthService,
              injector: Injector) {
    super(TaskCategory, ServerApi.TASK_CATEGORIES.resource, injector);
  }

  /**
   * Get all categories to authenticated specified user.
   */
  public getAllByUser(): Observable<Array<TaskCategory>> {
    return this.search(ServerApi.TASK_CATEGORIES.allByUser.query, {
      params: [
        {
          key: ServerApi.TASK_CATEGORIES.allByUser.userParam,
          value: this.authService.getUser()
        }
      ]
    });
  }

}
