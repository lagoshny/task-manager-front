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
import { LoggerTestingModule } from 'ngx-logger/testing';

@Component({
  selector: 'tm-quick-task-create',
  template: `
    <div class="task-add" (click)="afterAddedTask.emit()"></div>`
})
class QuickTaskCreateComponent {
  @Output()
  public readonly afterAddedTask = new EventEmitter<Task>();
}

@Component({
  selector: 'tm-task',
  template: `
    <div class="task-select" (click)="clickTask.emit(task)"></div>
    <div class="task__remove_button" (click)="removeTask.emit(task)"></div>`
})
class TaskComponent {
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
  let routerSpy: any;
  let activatedRouteStub: any;
  let taskServiceSpy: any;

  beforeEach(waitForAsync(() => {
    routerSpy = {
      navigate: jasmine.createSpy('navigate')
    };
    activatedRouteStub = new ActivatedRouteStub({});
    taskServiceSpy = {
      deleteResource: jasmine.createSpy('deleteResource'),
      getAllUserTasks: jasmine.createSpy('getAllUserTasks'),
      getFilteredUserTasksByCategories: jasmine.createSpy('getFilteredUserTasksByCategories')
    };
    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule
      ],
      declarations: [
        QuickTaskCreateComponent,
        TaskComponent,
        TaskListComponent
      ],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        {provide: TaskService, useValue: taskServiceSpy},
        TaskCategoryService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TaskListComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should create the comp', () => {
    expect(comp).toBeTruthy();
  });

  it('should load all users tasks after init comp', () => {
    taskServiceSpy.getAllUserTasks.and.returnValue(of(new Task()));

    fixture.detectChanges();

    expect(taskServiceSpy.getAllUserTasks.calls.count()).toBe(1);
  });

  it('should navigate to edit task form when click by task', () => {
    const testTask = getTestTask();
    testTask.category.prefix = 'test';
    testTask.number = 1;
    const resourcePage = new PagedResourceCollection(new ResourceCollection<Task>());
    resourcePage.resources = [testTask];

    taskServiceSpy.getAllUserTasks.and.returnValue(of(resourcePage));
    routerSpy.navigate.and.returnValue(Promise.resolve());

    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    const taskComp = templateHelper.query<HTMLDivElement>('.task-select');

    taskComp.click();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['tasks/edit', 'test-1']);
  });

  it('should hide tasks list when minimize is TRUE', () => {
    const resourcePage = new PagedResourceCollection(new ResourceCollection<Task>());
    resourcePage.resources = [new Task()];
    taskServiceSpy.getAllUserTasks.and.returnValue(of(resourcePage));
    fixture.detectChanges();

    comp.onMinimizeTasks();
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    expect(templateHelper.query('tm-quick-task-create')).toBeNull();
    expect(templateHelper.query('tm-task')).toBeNull();
    expect(templateHelper.query('.task-list__minimize_button__icon .fa-eye')).toBeDefined();
  });

  it('should show tasks list when minimize is FALSE', () => {
    const resourcePage = new PagedResourceCollection(new ResourceCollection<Task>());
    resourcePage.resources = [new Task()];
    taskServiceSpy.getAllUserTasks.and.returnValue(of(resourcePage));
    fixture.detectChanges();

    comp.onMinimizeTasks();
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    expect(templateHelper.query('tm-quick-task-create')).toBeDefined();
    expect(templateHelper.query('tm-task')).toBeDefined();
    expect(templateHelper.query('.task-list__minimize_button__icon .fa-eye-slash')).toBeDefined();
  });

  it('should delete task when click by delete button', () => {
    const resourcePage = new PagedResourceCollection(new ResourceCollection<Task>());
    resourcePage.resources = [new Task()];
    taskServiceSpy.getAllUserTasks.and.returnValue(of(resourcePage));
    taskServiceSpy.deleteResource.and.returnValue(of());
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    const removeTaskButton = templateHelper.query<HTMLDivElement>('.task__remove_button');

    removeTaskButton.click();

    expect(taskServiceSpy.deleteResource.calls.count()).toBe(1);
  });

  it('should update task list after added new one', () => {
    const resourcePage = new PagedResourceCollection(new ResourceCollection<Task>());
    resourcePage.resources = [new Task()];
    taskServiceSpy.getAllUserTasks.and.returnValue(of(resourcePage));
    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    const quickTaskCreateEl = templateHelper.query<HTMLElement>('.task-add');

    quickTaskCreateEl.click();

    expect(taskServiceSpy.getAllUserTasks.calls.count()).toBe(2);
  });

  it('should refresh task list by taskCategoryService tasks change event', () => {
    taskServiceSpy.getAllUserTasks.and.returnValue(of());
    fixture.detectChanges();

    expect(taskServiceSpy.getAllUserTasks.calls.count()).toBe(1);

    const taskCategoryService: TaskCategoryService = TestBed.inject(TaskCategoryService);
    taskCategoryService.refreshTasks();

    expect(taskServiceSpy.getAllUserTasks.calls.count()).toBe(2);
  });

  it('should filtered task list using list of categories by taskCategoryService categoriesByFilter change event', () => {
    taskServiceSpy.getAllUserTasks.and.returnValue(of());
    taskServiceSpy.getFilteredUserTasksByCategories.and.returnValue(of());
    fixture.detectChanges();

    const taskCategory = new TaskCategory();
    taskCategory.id = 1;
    const taskCategories = new Array<TaskCategory>(taskCategory);

    const taskCategoryService: TaskCategoryService = TestBed.inject(TaskCategoryService);
    taskCategoryService.updateCategoriesByFilter(taskCategories);

    expect(taskServiceSpy.getFilteredUserTasksByCategories.calls.count()).toBe(1);
  });

  it('should invoke refresh category list after add new task', () => {
    taskServiceSpy.getAllUserTasks.and.returnValue(of());
    fixture.detectChanges();
    const taskCategoryService: TaskCategoryService = TestBed.inject(TaskCategoryService);
    const spyRefreshCategories = spyOn(taskCategoryService, 'refreshCategories');

    comp.onAddedTask();

    expect(spyRefreshCategories.calls.count()).toBe(1);
  });

});
