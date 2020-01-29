import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourcePage } from '@lagoshny/ngx-hal-client';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TaskStatus } from '../../../core/models/constants/task-status.items';
import { Task } from '../../../core/models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
    selector: 'tm-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {

    public viewTasks: Array<Task> = [];

    public minimizeTasks = false;

    private tasks: ResourcePage<Task>;

    private subs: Array<Subscription> = [];

    private taskPageSize = 20;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private taskService: TaskService,
                private logger: NGXLogger) {
    }

    public ngOnInit(): void {
        this.updateTaskList();
    }

    @HostListener('window:scroll', [])
    public onWindowClick(): void {
        if ((window.innerHeight + window.scrollY + 1) >= document.body.scrollHeight) {
            // When have reached to end of the screen then load new part of data
            this.loadNewPortion();
        }
    }

    public onClickTask(task: Task): void {
        this.router.navigate(['tasks/edit', `${task.category.prefix}-${task.number}`])
            .catch(reason => this.logger.error(reason));
    }

    public ngOnDestroy(): void {
        this.subs.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
    }

    public onMinimizeTasks(): void {
        this.minimizeTasks = !this.minimizeTasks;
    }

    public onAddedTask(): void {
        this.updateTaskList();
    }

    public onRemoveTask(task: Task): void {
        this.taskService.delete(task).subscribe(() => {
            _.remove(this.viewTasks, (t: Task) => t.id === task.id);
        });
    }

    private loadAllUserTasks(): void {
        this.subs.push(
            this.taskService.getAllUserTasks(this.taskPageSize)
                .subscribe((value: ResourcePage<Task>) => {
                    this.viewTasks = value.resources;
                    this.tasks = value;
                })
        );
    }

    public loadNewPortion(): void {
        if (!this.tasks || !this.tasks.hasNext()) {
            return;
        }
        this.subs.push(
            this.tasks.next()
                .pipe(
                    tap((tasks: ResourcePage<Task>) => {
                        tasks.resources.forEach((task: Task) => {
                            task.status = TaskStatus.getByCode(task.status).name;
                        });
                    })
                )
                .subscribe((value: ResourcePage<Task>) => {
                    this.viewTasks.push(...value.resources);
                    this.tasks = value;
                })
        );
    }

    public updateTaskList(): void {
        this.loadAllUserTasks();
    }

}
