import { Injectable } from '@angular/core';
import { HateoasResourceOperation, ResourceCollection } from '@lagoshny/ngx-hateoas-client';
import { Observable } from 'rxjs';
import { ServerApi } from '../../app.config';
import { TaskCategory } from '../../core/models/task-category.model';
import { AuthService } from '../../core/services/auth.service';
import { map } from 'rxjs/operators';

@Injectable()
export class CategoryService extends HateoasResourceOperation<TaskCategory> {

  constructor(private authService: AuthService) {
    super(TaskCategory);
  }

  /**
   * Get all categories to authenticated specified user.
   */
  public getAllByUser(): Observable<Array<TaskCategory>> {
    return this.searchCollection(ServerApi.TASK_CATEGORIES.allByUser.query, {
      params: {
        [ServerApi.TASK_CATEGORIES.allByUser.userParam]: this.authService.getUser()
      }
    })
      .pipe(
        map((result: ResourceCollection<TaskCategory>) => {
          return result.resources;
        })
      );
  }

  /**
   * Get user's category by category prefix.
   *
   * @param prefix category to find
   */
  public getByPrefix(prefix: string): Observable<TaskCategory> {
    return this.searchResource(ServerApi.TASK_CATEGORIES.byPrefix.query, {
      params: {
        [ServerApi.TASK_CATEGORIES.byPrefix.prefixParam]: prefix,
        [ServerApi.TASK_CATEGORIES.byPrefix.userParam]: this.authService.getUser()
      }
    });
  }

}
