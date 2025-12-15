import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TaskCategory } from '../../../core/models/task-category.model';
import { Task } from '../../../core/models/task.model';
import { TaskCategoryService } from '../../../core/services/task-category.service';
import { ActivatedRouteStub } from '../../../utils/activated-route-stub';
import { TemplateHelper } from '../../../utils/template.helper';
import { TaskService } from '../../services/task.service';
import { getTestTask } from '../test.helper';
import { TaskListComponent } from './task-list.component';
import { PagedResourceCollection, ResourceCollection } from '@lagoshny/ngx-hateoas-client';
import { NgClass } from '@angular/common';
import { QuickTaskCreateComponent } from '../quick-task-create/quick-task-create.component';
import { TaskComponent } from '../task/task.component';
import { Mocked } from 'vitest';

// import { LoggerTestingModule } from 'ngx-logger/testing';

@Component({
  selector: 'tm-quick-task-create',
  template: `
    <div class="task-add" (click)="afterAddedTask.emit()"></div>`,
  standalone: true,
})
class QuickTaskCreateStubComponent {
  @Output()
  public readonly afterAddedTask = new EventEmitter<Task>();
}

@Component({
  selector: 'tm-task',
  template: `
    <div class="task-select" (click)="clickTask.emit(task)"></div>
    <div class="task__remove_button" (click)="removeTask.emit(task)"></div>
  `,
  standalone: true,
})
class TaskStubComponent {
  @Output()
  public readonly clickTask = new EventEmitter<Task>();
  @Output()
  public readonly removeTask = new EventEmitter<Task>();
  @Input()
  public task: Task;
}

describe('TaskListComponent', () => {
  let fixture: ComponentFixture<TaskListComponent>;
  let comp: TaskListComponent;
  let routerSpy: Mocked<Pick<Router, 'navigate'>>;
  let activatedRouteStub: ActivatedRouteStub;
  let taskServiceSpy: Mocked<Pick<TaskService, 'deleteResource' | 'getAllUserTasks' | 'getFilteredUserTasksByCategories'>>;
  let taskCategoryService: TaskCategoryService;

  function paged(tasks: Task[] = []): PagedResourceCollection<Task> {
    const page = new PagedResourceCollection(new ResourceCollection<Task>());
    page.resources = tasks;
    return page;
  }

  beforeEach(waitForAsync(() => {
    routerSpy = { navigate: vi.fn() };
    activatedRouteStub = new ActivatedRouteStub({});
    taskServiceSpy = {
      deleteResource: vi.fn(),
      getAllUserTasks: vi.fn(),
      getFilteredUserTasksByCategories: vi.fn()
    };

    taskServiceSpy.getAllUserTasks.mockReturnValue(of(paged([])));

    TestBed.configureTestingModule({
      imports: [
        NgClass,
        TaskListComponent,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: TaskService, useValue: taskServiceSpy },
        TaskCategoryService
      ]
    });

    TestBed.overrideComponent(TaskListComponent, {
      remove: {
        imports: [
          QuickTaskCreateComponent,
          TaskComponent,
        ],
      },
      add: {
        imports: [
          QuickTaskCreateStubComponent,
          TaskStubComponent,
        ],
      },
    });

    TestBed.compileComponents()
      .then(() => {
        taskCategoryService = TestBed.inject(TaskCategoryService);
      });
  }));

  it('should create the comp', () => {
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('should load all users tasks after init comp', () => {
    taskServiceSpy.getAllUserTasks.mockReturnValue(of(paged()));
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();

    expect(taskServiceSpy.getAllUserTasks).toHaveBeenCalledTimes(1);
  });

  it('should navigate to edit task form when click by task', () => {
    const testTask = getTestTask();
    testTask.category.prefix = 'test';
    testTask.number = 1;
    const resourcePage = new PagedResourceCollection(new ResourceCollection<Task>());
    resourcePage.resources = [testTask];

    taskServiceSpy.getAllUserTasks.mockReturnValue(of(resourcePage));
    routerSpy.navigate.mockResolvedValue(true);
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    const taskComp = templateHelper.query<HTMLDivElement>('.task-select');

    taskComp.click();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['tasks/edit', 'test-1']);
  });

  it('should hide tasks list when minimize is TRUE', () => {
    const resourcePage = new PagedResourceCollection(new ResourceCollection<Task>());
    resourcePage.resources = [new Task()];
    taskServiceSpy.getAllUserTasks.mockReturnValue(of(resourcePage));
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    const hideIcon = templateHelper.query<HTMLElement>('.task-list__minimize_button__icon');
    hideIcon.click();

    fixture.detectChanges();

    expect(templateHelper.query('tm-quick-task-create')).toBeNull();
    expect(templateHelper.query('tm-task')).toBeNull();
    expect(templateHelper.query('.task-list__minimize_button__icon .fa-eye')).toBeDefined();
  });

  it('should show tasks list when minimize is FALSE', () => {
    const resourcePage = new PagedResourceCollection(new ResourceCollection<Task>());
    resourcePage.resources = [new Task()];
    taskServiceSpy.getAllUserTasks.mockReturnValue(of(resourcePage));
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    const hideIcon = templateHelper.query<HTMLElement>('.task-list__minimize_button__icon');
    hideIcon.click();
    comp.onMinimizeTasks();
    fixture.detectChanges();

    expect(templateHelper.query('tm-quick-task-create')).toBeDefined();
    expect(templateHelper.query('tm-task')).toBeDefined();
    expect(templateHelper.query('.task-list__minimize_button__icon .fa-eye-slash')).toBeDefined();
  });

  it('should delete task when click by delete button', () => {
    const resourcePage = new PagedResourceCollection(new ResourceCollection<Task>());
    resourcePage.resources = [new Task()];
    taskServiceSpy.getAllUserTasks.mockReturnValue(of(resourcePage));
    taskServiceSpy.deleteResource.mockReturnValue(of());
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    const removeTaskButton = templateHelper.query<HTMLDivElement>('.task__remove_button');

    removeTaskButton.click();

    expect(taskServiceSpy.deleteResource).toHaveBeenCalledOnce();
  });

  it('should update task list after added new one', () => {
    taskServiceSpy.getAllUserTasks.mockReturnValue(of(paged([new Task()])));
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    const template = new TemplateHelper(fixture);
    template.query<HTMLElement>('.task-add').click();

    expect(taskServiceSpy.getAllUserTasks).toHaveBeenCalledTimes(2);
  });

  it('should refresh task list by taskCategoryService tasks change event', () => {
    taskServiceSpy.getAllUserTasks.mockReturnValue(of(paged()));
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    taskCategoryService.refreshTasks();

    expect(taskServiceSpy.getAllUserTasks).toHaveBeenCalledTimes(2);
  });

  it('should filtered task list using list of categories by taskCategoryService categoriesByFilter change event', () => {
    taskServiceSpy.getAllUserTasks.mockReturnValue(of(paged()));
    taskServiceSpy.getFilteredUserTasksByCategories.mockReturnValue(of(paged()));
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    const taskCategory = new TaskCategory();
    taskCategory.id = 1;
    taskCategoryService.updateCategoriesByFilter([taskCategory]);

    expect(taskServiceSpy.getFilteredUserTasksByCategories).toHaveBeenCalled();
  });

  it('should invoke refresh category list after add new task', () => {
    taskServiceSpy.getAllUserTasks.mockReturnValue(of(paged()));
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    const spyRefreshCategories = vi.spyOn(taskCategoryService, 'refreshCategories');

    comp.onAddedTask();

    expect(spyRefreshCategories).toHaveBeenCalled();
  });
});
