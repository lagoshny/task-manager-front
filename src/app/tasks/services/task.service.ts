import { Injectable } from '@angular/core';
import { HateoasResourceOperation, PagedResourceCollection } from '@lagoshny/ngx-hateoas-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ServerApi } from '../../app.config';
import { TaskStatus } from '../../core/models/constants/task-status.items';
import { Task } from '../../core/models/task.model';
import { AuthService } from '../../core/services/auth.service';

@Injectable()
export class TaskService extends HateoasResourceOperation<Task> {

  constructor(private authService: AuthService) {
    super(ServerApi.TASKS.resource);
  }

  public getByCategoryPrefixAndNumber(categoryPrefix: string, num: number): Observable<Task> {
    return this.searchResource(ServerApi.TASKS.byNumberAndCategory.query, {
      params: {
        [ServerApi.TASKS.byNumberAndCategory.authorParam]: this.authService.getUser(),
        [ServerApi.TASKS.byNumberAndCategory.numberParam]: num,
        [ServerApi.TASKS.byNumberAndCategory.categoryParam]: categoryPrefix
      }
    });
  }

  public create(task: Task): Observable<Observable<never> | Task> {
    task.author = this.authService.getUser();
    return super.createResource({body: task});
  }

  public getAllUserTasks(taskPageSize: number): Observable<PagedResourceCollection<Task>> {
    return this.searchPage(ServerApi.TASKS.allByAuthor.query, {
      pageParams: {
        size: taskPageSize
      },
      params: {
        [ServerApi.TASKS.allByAuthor.authorParam]: this.authService.getUser(),
        [ServerApi.TASKS.projections.taskProjection.key]: ServerApi.TASKS.projections.taskProjection.value
      }
    })
      .pipe(
        tap((tasks: PagedResourceCollection<Task>) => {
          tasks.resources.forEach((task: Task) => {
            task.status = TaskStatus.getByCode(task.status).name;
          });
        })
      );
  }

  public getFilteredUserTasksByCategories(categoriesIds: string,
                                          taskPageSize: number): Observable<PagedResourceCollection<Task>> {
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
        tap((tasks: PagedResourceCollection<Task>) => {
          tasks.resources.forEach((task: Task) => {
            task.status = TaskStatus.getByCode(task.status).name;
          });
        }));
  }

}
