import { Component, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TaskStatus } from '../../../core/models/constants/task-status.items';
import { TaskCategory } from '../../../core/models/task-category.model';
import { NotificationService } from '../../../core/services/notification.service';
import { TemplateHelper } from '../../../utils/template.helper';
import { CategoryService } from '../../services/category.service';
import { TaskService } from '../../services/task.service';
import { getTestTask } from '../test.helper';
import { TaskFormComponent } from './task-form.component';
import { provideNgxValidationMessages } from '@lagoshny/ngx-validation-messages';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRouteStub } from '../../../utils/activated-route-stub';

@Component({
  selector: 'tm-task-status',
  template: '',
  standalone: true
})
export class TaskStatusChangerComponent {
  @Input()
  public status: string;
}

describe('TaskFormComponent', () => {
  let fixture: ComponentFixture<TaskFormComponent>;
  let comp: TaskFormComponent;
  let router: Router;
  let activatedRouteStub: ActivatedRouteStub;

  let taskServiceSpy: any;
  let taskCategoryServiceSpy: any;
  let notificationServiceSpy: any;
  let authServiceSpy: any;

  beforeEach(async () => {
    activatedRouteStub = new ActivatedRouteStub({});
    taskServiceSpy = {
      getByCategoryPrefixAndNumber: jasmine.createSpy('getByCategoryPrefixAndNumber'),
      create: jasmine.createSpy('create'),
      patchResource: jasmine.createSpy('patchResource')
    };

    taskCategoryServiceSpy = {
      getAllByUser: jasmine.createSpy('getAllByUser')
    };

    notificationServiceSpy = {
      showSuccess: jasmine.createSpy('showSuccess'),
      showErrors: jasmine.createSpy('showErrors')
    };

    authServiceSpy = {
      getUser: jasmine.createSpy('getUser')
    };

    taskCategoryServiceSpy.getAllByUser.and.returnValue(of([]));
    authServiceSpy.getUser.and.returnValue({username: 'test-user'} as any);

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatButtonModule,
        MatInputModule,
        MatTooltipModule,
        TaskStatusChangerComponent,
        TaskFormComponent,
      ],
      providers: [
        provideNgxValidationMessages({messages: {}}),
        provideRouter([]),
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        {provide: TaskService, useValue: taskServiceSpy},
        {provide: CategoryService, useValue: taskCategoryServiceSpy},
        {provide: NotificationService, useValue: notificationServiceSpy},
        {provide: AuthService, useValue: authServiceSpy}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    comp = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('should create the comp', () => {
    expect(comp).toBeDefined();
  });

  it('should get all user categories', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of([
      new TaskCategory(),
      new TaskCategory()
    ]));

    fixture.detectChanges();

    expect(comp.viewCategories.length).toBe(2);
  });

  it('when NEW task then header is "Create task"', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    activatedRouteStub.setParamMap({});

    fixture.detectChanges();

    expect(comp.formHeader).toBe('Create task');
  });

  it('when NEW task then buttonName is "Create"', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    activatedRouteStub.setParamMap({});

    fixture.detectChanges();

    expect(comp.buttonName).toBe('Create');
  });

  it('when EDIT task then header is "Edit task"', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of());
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });

    fixture.detectChanges();

    expect(comp.formHeader).toBe('Edit task');
  });

  it('when EDIT task then buttonName is "Save"', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of());
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });

    fixture.detectChanges();

    expect(comp.buttonName).toBe('Save');
  });

  it('when EDIT task then url should has task param as number task and category prefix', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of());
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });

    fixture.detectChanges();

    const firstArgAsCategoryPrefix = taskServiceSpy.getByCategoryPrefixAndNumber.calls.argsFor(0)[0];
    const secondArgAsCategoryNumber = taskServiceSpy.getByCategoryPrefixAndNumber.calls.argsFor(0)[1];
    expect(firstArgAsCategoryPrefix).toBe('TEST');
    expect(secondArgAsCategoryNumber).toBe(1);
  });

  it('when EDIT task should get category for this task', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    const taskToEdit = {
      getRelation: jasmine.createSpy('getRelation')
    };
    taskToEdit.getRelation.and.returnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });

    fixture.detectChanges();

    expect(comp.taskForm.get('category').value).toBeDefined();
  });

  it('should navigate to "home" page when get task to EDIT error occurs', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(
      throwError(() => 'An error occurred while getting the task'));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should create task', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    taskServiceSpy.create.and.returnValue(of(getTestTask()));
    fixture.detectChanges();

    comp.sendForm();

    expect(taskServiceSpy.create.calls.count()).toBe(1);
    expect(taskServiceSpy.create.calls.argsFor(0)[0]).toBeDefined();
  });

  it('NEW task should has "new" status', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    taskServiceSpy.create.and.returnValue(of(getTestTask()));
    fixture.detectChanges();

    comp.sendForm();

    expect(taskServiceSpy.create.calls.count()).toBe(1);
    expect(taskServiceSpy.create.calls.argsFor(0)[0].status).toBe(TaskStatus.NEW.code);
  });

  it('after create task should navigate to "home" page', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of([]));
    const newTask = getTestTask();
    taskServiceSpy.create.and.returnValue(of(newTask));
    fixture.detectChanges();

    comp.sendForm();

    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('after create task should show success notification', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    const newTask = getTestTask();
    taskServiceSpy.create.and.returnValue(of(newTask));
    fixture.detectChanges();

    comp.sendForm();

    expect(notificationServiceSpy.showSuccess.calls.count()).toBe(1);
  });

  it('should update task', fakeAsync(() => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    const taskToEdit = {
      ...getTestTask(),
      status: TaskStatus.IN_PROGRESS.code,
      getRelation: jasmine.createSpy('getRelation')
    };
    taskToEdit.getRelation.and.returnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();
    expect(taskServiceSpy.patchResource.and.returnValue(of()));

    comp.sendForm();

    expect(taskServiceSpy.patchResource.calls.count()).toBe(1);
    expect(taskServiceSpy.patchResource.calls.argsFor(0)[0]).toBeDefined();
  }));

  it('when needTimeManagement is TRUE then totalTime and spentTime are equal or great than 0', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    activatedRouteStub.setParamMap({});
    fixture.detectChanges();
    comp.taskForm.get('spentTime').setValue(null);
    comp.taskForm.get('totalTime').setValue(null);

    comp.taskForm.get('needTimeManagement').setValue(true);

    expect(comp.taskForm.get('totalTime').valid).toBeFalse();
    expect(comp.taskForm.get('spentTime').valid).toBeFalse();
  });

  it('when needTimeManagement is FALSE then totalTime and spentTime are NOT REQUIRED', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    activatedRouteStub.setParamMap({});
    fixture.detectChanges();
    comp.taskForm.get('spentTime').setValue(null);
    comp.taskForm.get('totalTime').setValue(null);

    comp.taskForm.get('needTimeManagement').setValue(false);

    expect(comp.taskForm.get('totalTime').valid).toBeTrue();
    expect(comp.taskForm.get('spentTime').valid).toBeTrue();
  });

  it('when need time management is TRUE and auto reduce is FALSE then spent time is ENABLE', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    activatedRouteStub.setParamMap({});
    fixture.detectChanges();

    comp.taskForm.get('needTimeManagement').setValue(true);
    comp.taskForm.get('autoReduce').setValue(false);

    expect(comp.taskForm.get('spentTime').enabled).toBeTrue();
  });

  it('when need time management is TRUE  and auto reduce is TRUE then spent time is DISABLE', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    activatedRouteStub.setParamMap({});
    fixture.detectChanges();

    comp.taskForm.get('needTimeManagement').setValue(true);
    comp.taskForm.get('autoReduce').setValue(true);

    expect(comp.taskForm.get('spentTime').disabled).toBeTrue();
  });

  it('when need time management is TRUE and auto reduce is FALSE then spent time is REQUIRED', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    activatedRouteStub.setParamMap({});
    fixture.detectChanges();
    comp.taskForm.get('spentTime').setValue(null);

    comp.taskForm.get('needTimeManagement').setValue(true);
    comp.taskForm.get('autoReduce').setValue(false);

    expect(comp.taskForm.get('spentTime').valid).toBeFalse();
  });

  it('should disable needTimeManagement and autoReduce checkbox when task in "IN_PROGRESS" status', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    const taskToEdit = {
      ...getTestTask(),
      status: TaskStatus.IN_PROGRESS.code,
      getRelation: jasmine.createSpy('getRelation')
    };
    taskToEdit.getRelation.and.returnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();

    expect(comp.taskForm.get('needTimeManagement').disabled).toBeTrue();
    expect(comp.taskForm.get('autoReduce').disabled).toBeTrue();
  });

  it('should disable needTimeManagement and autoReduce checkbox when task in "COMPLETED" status', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    const taskToEdit = {
      ...getTestTask(),
      status: TaskStatus.COMPLETED.code,
      getRelation: jasmine.createSpy('getRelation')
    };
    taskToEdit.getRelation.and.returnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();

    expect(comp.taskForm.get('needTimeManagement').disabled).toBeTrue();
    expect(comp.taskForm.get('autoReduce').disabled).toBeTrue();
  });

  it('should disable needTimeManagement and autoReduce checkbox when task in "CANCELED" status', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    const taskToEdit = {
      ...getTestTask(),
      status: TaskStatus.CANCELED.code,
      getRelation: jasmine.createSpy('getRelation')
    };
    taskToEdit.getRelation.and.returnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();

    expect(comp.taskForm.get('needTimeManagement').disabled).toBeTrue();
    expect(comp.taskForm.get('autoReduce').disabled).toBeTrue();
  });

  it('should disable needTimeManagement and autoReduce checkbox when task in "NOT_COMPLETED" status', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    const taskToEdit = {
      ...getTestTask(),
      status: TaskStatus.NOT_COMPLETED.code,
      getRelation: jasmine.createSpy('getRelation')
    };
    taskToEdit.getRelation.and.returnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();

    expect(comp.taskForm.get('needTimeManagement').disabled).toBeTrue();
    expect(comp.taskForm.get('autoReduce').disabled).toBeTrue();
  });

  it('should show extra tooltip when autoReduce is DISABLE', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    const taskToEdit = {
      ...getTestTask(),
      status: TaskStatus.NOT_COMPLETED.code,
      getRelation: jasmine.createSpy('getRelation')
    };
    taskToEdit.getRelation.and.returnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();
    const templateHelper = new TemplateHelper(fixture);

    expect(comp.taskForm.get('autoReduce').disabled).toBeTrue();
    expect(templateHelper.query('task_form__tooltip task_form__tooltip_extra')).toBeDefined();
  });

  it('should show extra tooltip when needTimeManagement is DISABLE', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    const taskToEdit = {
      ...getTestTask(),
      status: TaskStatus.NOT_COMPLETED.code,
      getRelation: jasmine.createSpy('getRelation')
    };
    taskToEdit.getRelation.and.returnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();
    const templateHelper = new TemplateHelper(fixture);

    expect(comp.taskForm.get('needTimeManagement').disabled).toBeTrue();
    expect(templateHelper.query('task_form__tooltip task_form__tooltip_extra')).toBeDefined();
  });

  it('after success update task status should be success message', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    const taskToEdit = {
      ...getTestTask(),
      status: TaskStatus.NOT_COMPLETED.code,
      getRelation: jasmine.createSpy('getRelation'),
      postRelation: jasmine.createSpy('postRelation')
    };
    taskToEdit.getRelation.and.returnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of(taskToEdit));

    const updatedTask = {...taskToEdit, status: TaskStatus.IN_PROGRESS.code};
    taskToEdit.postRelation.and.returnValue(of(updatedTask));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();

    comp.onChangeStatus(TaskStatus.IN_PROGRESS);

    expect(notificationServiceSpy.showErrors.calls.count()).toBe(0);
    expect(notificationServiceSpy.showSuccess.calls.count()).toBe(1);
  });

  it('after fail update task status should be failed message', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    const taskToEdit = {
      ...getTestTask(),
      status: TaskStatus.NOT_COMPLETED.code,
      getRelation: jasmine.createSpy('getRelation'),
      postRelation: jasmine.createSpy('postRelation')
    };
    taskToEdit.getRelation.and.returnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of(taskToEdit));

    taskToEdit.postRelation.and.returnValue(throwError('Error occurs while update task '));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();

    comp.onChangeStatus(TaskStatus.IN_PROGRESS);

    expect(notificationServiceSpy.showErrors.calls.count()).toBe(1);
    expect(notificationServiceSpy.showSuccess.calls.count()).toBe(0);
  });

  it('task status component should be hidden for new task', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    activatedRouteStub.setParamMap({});

    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    expect(templateHelper.query('tm-task-status')).toBeNull();
  });

  it('task status component should be visible when edit task', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    const taskToEdit = {
      ...getTestTask(),
      status: TaskStatus.IN_PROGRESS.code,
      getRelation: jasmine.createSpy('getRelation')
    };
    taskToEdit.getRelation.and.returnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });

    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    expect(templateHelper.query('tm-task-status')).toBeDefined();
  });

  it('needTimeManagement ui element should be hidden for new task', () => {
    activatedRouteStub.setParamMap({});
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());

    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    expect(templateHelper.query('.task_form__need_time_management')).toBeNull();
  });

  it('needTimeManagement ui element should be visible when edit task', () => {
    taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
    const taskToEdit = {
      ...getTestTask(),
      status: TaskStatus.IN_PROGRESS.code,
      getRelation: jasmine.createSpy('getRelation')
    };
    taskToEdit.getRelation.and.returnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });

    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    expect(templateHelper.query('.task_form__need_time_management')).toBeDefined();
  });

});
