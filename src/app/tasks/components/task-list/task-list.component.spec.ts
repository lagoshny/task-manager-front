import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TaskCategory } from '../../../core/models/task-category.model';
import { Task } from '../../../core/models/task.model';
import { TaskCategoryService } from '../../../core/services/task-category.service';
import { ActivatedRouteStub } from '../../../utils/activated-route-stub';
import { TemplateHelper } from '../../../utils/template.helper';
import { getTestTask } from '../test.helper';
import { TaskListComponent } from './task-list.component';
import { PagedResourceCollection, ResourceCollection } from '@lagoshny/ngx-hateoas-client';
import { NgClass } from '@angular/common';
import { QuickTaskCreateComponent } from '../quick-task-create/quick-task-create.component';
import { TaskComponent } from '../task/task.component';
import { Mocked } from 'vitest';
import { TaskProjectionService } from '../../services/task-projection.service';

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
  let taskProjectionServiceSpy: Mocked<Pick<TaskProjectionService,
    'deleteResource' | 'getAllUserTasks' | 'getFilteredUserTasksByCategories'>>;
  let taskCategoryService: TaskCategoryService;

  function paged(tasks: Task[] = []): PagedResourceCollection<Task> {
    const page = new PagedResourceCollection(new ResourceCollection<Task>());
    page.resources = tasks;
    return page;
  }

  beforeEach(() => {
    routerSpy = { navigate: vi.fn() };
    activatedRouteStub = new ActivatedRouteStub({});
    taskProjectionServiceSpy = {
      deleteResource: vi.fn(),
      getAllUserTasks: vi.fn(),
      getFilteredUserTasksByCategories: vi.fn()
    };

    taskProjectionServiceSpy.getAllUserTasks.mockReturnValue(of(paged([])));

    TestBed.configureTestingModule({
      imports: [
        NgClass,
        TaskListComponent,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: TaskProjectionService, useValue: taskProjectionServiceSpy },
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
  });

  it('should load all users tasks after init comp', () => {
    taskProjectionServiceSpy.getAllUserTasks.mockReturnValue(of(paged()));
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();

    expect(taskProjectionServiceSpy.getAllUserTasks).toHaveBeenCalledTimes(1);
  });

  it('should navigate to edit task form when click by task', () => {
    const testTask = getTestTask();
    testTask.category.prefix = 'test';
    testTask.number = 1;
    const resourcePage = new PagedResourceCollection(new ResourceCollection<Task>());
    resourcePage.resources = [testTask];

    taskProjectionServiceSpy.getAllUserTasks.mockReturnValue(of(resourcePage));
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
    taskProjectionServiceSpy.getAllUserTasks.mockReturnValue(of(resourcePage));
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
    taskProjectionServiceSpy.getAllUserTasks.mockReturnValue(of(resourcePage));
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
    taskProjectionServiceSpy.getAllUserTasks.mockReturnValue(of(resourcePage));
    taskProjectionServiceSpy.deleteResource.mockReturnValue(of());
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    const removeTaskButton = templateHelper.query<HTMLElement>('.task__remove_button');

    removeTaskButton.click();

    expect(taskProjectionServiceSpy.deleteResource).toHaveBeenCalledOnce();
  });

  it('should update task list after added new one', () => {
    taskProjectionServiceSpy.getAllUserTasks.mockReturnValue(of(paged([new Task()])));
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    const template = new TemplateHelper(fixture);
    template.query<HTMLElement>('.task-add').click();

    expect(taskProjectionServiceSpy.getAllUserTasks).toHaveBeenCalledTimes(2);
  });

  it('should refresh task list by taskCategoryService tasks change event', () => {
    taskProjectionServiceSpy.getAllUserTasks.mockReturnValue(of(paged()));
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    taskCategoryService.refreshTasks();

    expect(taskProjectionServiceSpy.getAllUserTasks).toHaveBeenCalledTimes(2);
  });

  it('should filtered task list using list of categories by taskCategoryService categoriesByFilter change event', async () => {
    taskProjectionServiceSpy.getAllUserTasks.mockReturnValue(of(paged()));
    taskProjectionServiceSpy.getFilteredUserTasksByCategories.mockReturnValue(of(paged()));
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    const taskCategory = new TaskCategory();
    taskCategory.id = 1;
    taskCategoryService.updateCategoriesByFilter([taskCategory]);

    expect(taskProjectionServiceSpy.getFilteredUserTasksByCategories).toHaveBeenCalled();
  });

  it('should invoke refresh category list after add new task', () => {
    taskProjectionServiceSpy.getAllUserTasks.mockReturnValue(of(paged()));
    fixture = TestBed.createComponent(TaskListComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    const spyRefreshCategories = vi.spyOn(taskCategoryService, 'refreshCategories');

    comp.onAddedTask();

    expect(spyRefreshCategories).toHaveBeenCalled();
  });
});
