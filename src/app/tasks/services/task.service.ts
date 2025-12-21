import { Injectable } from '@angular/core';
import { HateoasResourceOperation } from '@lagoshny/ngx-hateoas-client';
import { Observable } from 'rxjs';
import { ServerApi } from '../../app.config';
import { Task } from '../../core/models/task.model';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends HateoasResourceOperation<Task> {

  constructor(private authService: AuthService) {
    super(Task);
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
    return super.createResource({ body: task });
  }

}
