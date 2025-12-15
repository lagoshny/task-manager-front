import { Injectable } from '@angular/core';
import { HateoasResourceOperation, PagedResourceCollection } from '@lagoshny/ngx-hateoas-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ServerApi } from '../../app.config';
import { TaskStatus } from '../../core/models/constants/task-status.items';
import { AuthService } from '../../core/services/auth.service';
import { TaskProjection } from '../../core/models/task.projection';

@Injectable({
  providedIn: 'root'
})
export class TaskProjectionService extends HateoasResourceOperation<TaskProjection> {

  constructor(private authService: AuthService) {
    super(TaskProjection);
  }

  public getAllUserTasks(taskPageSize: number): Observable<PagedResourceCollection<TaskProjection>> {
    return this.searchPage(ServerApi.TASKS.allByAuthor.query, {
        pageParams: {
          size: taskPageSize
        },
        params: {
          [ServerApi.TASKS.allByAuthor.authorParam]: this.authService.getUser(),
          [ServerApi.TASKS.projections.taskProjection.key]: ServerApi.TASKS.projections.taskProjection.value
        }
      }
    )
      .pipe(
        tap((tasks: PagedResourceCollection<TaskProjection>) => {
          tasks.resources.forEach((task: TaskProjection) => {
            task.status = TaskStatus.getByCode(task.status).name;
          });
        })
      );
  }

  public getFilteredUserTasksByCategories(categoriesIds: string,
                                          taskPageSize: number): Observable<PagedResourceCollection<TaskProjection>> {
    const author = this.authService.getUser();
    return this.searchPage(ServerApi.TASKS.allByAuthorAndCategories.query,
      {
        pageParams: {
          size: taskPageSize,
        },
        params: {
          [ServerApi.TASKS.allByAuthorAndCategories.authorParam]: author.id,
          [ServerApi.TASKS.allByAuthorAndCategories.categoriesIds]: categoriesIds,
          [ServerApi.TASKS.projections.taskProjection.key]: ServerApi.TASKS.projections.taskProjection.value
        }
      })
      .pipe(
        tap((tasks: PagedResourceCollection<TaskProjection>) => {
          tasks.resources.forEach((task: TaskProjection) => {
            task.status = TaskStatus.getByCode(task.status).name;
          });
        }));
  }

}
