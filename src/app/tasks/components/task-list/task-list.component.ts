import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagedResourceCollection } from '@lagoshny/ngx-hateoas-client';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TaskStatus } from '../../../core/models/constants/task-status.items';
import { TaskCategory } from '../../../core/models/task-category.model';
import { Task } from '../../../core/models/task.model';
import { TaskCategoryService } from '../../../core/services/task-category.service';
import { StringUtils } from '../../../core/utils/string.utils';
import { TaskService } from '../../services/task.service';
import { TaskProjection } from '../../../core/models/task.projection';

@Component({
  selector: 'tm-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {

  public viewTasks: Array<TaskProjection> = [];

  public minimizeTasks = false;

  private tasks: PagedResourceCollection<Task>;

  private subs: Array<Subscription> = [];

  private taskPageSize = 20;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private taskService: TaskService,
              private taskCategoryService: TaskCategoryService,
              private logger: NGXLogger) {
  }

  public ngOnInit(): void {
    this.loadAllUserTasks();
    this.subs.push(
      this.taskCategoryService.tasks.subscribe(() => {
        this.loadAllUserTasks();
      }),
      this.taskCategoryService.categoriesByFilter.subscribe((categories: Array<TaskCategory>) => {
        let categoriesIds = StringUtils.EMPTY;
        categories.forEach((value: TaskCategory) => {
          categoriesIds += `${ value.id },`;
        });
        this.loadAllUserTasks(categoriesIds);
      })
    );
  }

  @HostListener('window:scroll', [])
  public onWindowClick(): void {
    if ((window.innerHeight + window.scrollY + 1) >= document.body.scrollHeight) {
      // When have reached to end of the screen then load new part of data
      this.loadNewPortion();
    }
  }

  public onClickTask(task: Task): void {
    this.router.navigate(['tasks/edit', `${ task.category.prefix }-${ task.number }`])
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
    this.taskCategoryService.refreshCategories();
    this.loadAllUserTasks();
  }

  public onRemoveTask(task: Task): void {
    this.taskService.deleteResource(task).subscribe(() => {
      _.remove(this.viewTasks, (t: Task) => t.id === task.id);
    });
  }

  public loadNewPortion(): void {
    if (!this.tasks || !this.tasks.hasNext()) {
      return;
    }
    this.subs.push(
      this.tasks.next()
        .pipe(
          tap((tasks: PagedResourceCollection<Task>) => {
            tasks.resources.forEach((task: Task) => {
              task.status = TaskStatus.getByCode(task.status).name;
            });
          })
        )
        .subscribe((value: PagedResourceCollection<Task>) => {
          this.viewTasks.push(...value.resources);
          this.tasks = value;
        })
    );
  }

  private loadAllUserTasks(selectedTaskCategoriesIds?: string): void {
    if (selectedTaskCategoriesIds) {
      this.subs.push(
        this.taskService.getFilteredUserTasksByCategories(selectedTaskCategoriesIds, this.taskPageSize)
          .subscribe((value: PagedResourceCollection<Task>) => {
            this.viewTasks = value.resources;
            this.tasks = value;
          })
      );
    } else {
      this.subs.push(
        this.taskService.getAllUserTasks(this.taskPageSize)
          .subscribe((value: PagedResourceCollection<Task>) => {
            this.viewTasks = value.resources;
            this.tasks = value;
          })
      );
    }
  }

}
