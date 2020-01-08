import { Injectable, Injector } from '@angular/core';
import { ResourcePage, RestService } from '@lagoshny/ngx-hal-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ServerApi } from '../../app.config';
import { TaskStatus } from '../../core/models/constants/task-status.items';
import { Task } from '../../core/models/task.model';
import { AuthService } from '../../core/services/auth.service';

@Injectable()
export class TaskService extends RestService<Task> {

    constructor(injector: Injector,
                private authService: AuthService) {
        super(Task, ServerApi.TASKS.resource, injector);
    }

    public getByCategoryPrefixAndNumber(categoryPrefix: string, number: number): Observable<Task> {
        return this.searchSingle(ServerApi.TASKS.byNumberAndCategory.query, {
            params: [
                {
                    key: ServerApi.TASKS.byNumberAndCategory.authorParam,
                    value: this.authService.getUser()
                },
                {
                    key: ServerApi.TASKS.byNumberAndCategory.numberParam,
                    value: number
                },
                {
                    key: ServerApi.TASKS.byNumberAndCategory.categoryParam,
                    value: categoryPrefix
                }
            ]
        })
    }

    public create(task: Task): Observable<Observable<never> | Task> {
        task.author = this.authService.getUser();
        return super.create(task);
    }

    public getAllUserTasks(taskPageSize: number): Observable<ResourcePage<Task>> {
        return this.searchPage(ServerApi.TASKS.allByAuthor.query, {
            size: taskPageSize,
            params: [
                {
                    key: ServerApi.TASKS.allByAuthor.authorParam,
                    value: this.authService.getUser()
                },
                ServerApi.TASKS.projections.taskProjection
            ]
        })
            .pipe(
                tap((tasks: ResourcePage<Task>) => {
                    tasks.resources.forEach((task: Task) => {
                        task.status = TaskStatus.getByCode(task.status).name;
                    });
                })
            );
    }

}
