import { Injectable, Injector } from '@angular/core';
import { RestService } from '@lagoshny/ngx-hal-client';
import { Observable } from 'rxjs';
import { ServerApi } from '../../app.config';
import { Task } from '../../core/models/task.model';

@Injectable()
export class TaskService extends RestService<Task> {

    constructor(injector: Injector) {
        super(Task, ServerApi.TASKS.resource, injector);
    }

    public createTask(task: Task): Observable<Task | Observable<never>> {
        return this.create(task);
    }

    public updateTask(task: Task): Observable<Task | Observable<never>> {
        return this.patch(task);
    }

}
