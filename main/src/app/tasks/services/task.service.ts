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

    public createTask(task: Task): Observable<Task | Observable<never>> {
        return this.create(task);
    }

    public updateTask(task: Task): Observable<Task | Observable<never>> {
        return this.patch(task);
    }

    public getAllUserTasks(taskPageSize: number): Observable<ResourcePage<Task>> {
        const author = this.authService.getUser();
        return this.searchPage(ServerApi.TASKS.allByAuthor.query, {
            size: taskPageSize,
            params: [
                {
                    key: ServerApi.TASKS.allByAuthor.authorParam,
                    value: author.id
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
