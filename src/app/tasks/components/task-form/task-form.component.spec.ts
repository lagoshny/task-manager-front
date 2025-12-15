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
import { Task } from '../../../core/models/task.model';
import { NotificationService } from '../../../core/services/notification.service';
import { TemplateHelper } from '../../../utils/template.helper';
import { CategoryService } from '../../services/category.service';
import { TaskService } from '../../services/task.service';
import { getTestTask } from '../test.helper';
import { TaskFormComponent } from './task-form.component';
import { provideNgxValidationMessages } from '@lagoshny/ngx-validation-messages';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRouteStub } from '../../../utils/activated-route-stub';
import { Mocked } from 'vitest';

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

  let taskServiceSpy: Mocked<Pick<TaskService, 'getByCategoryPrefixAndNumber' | 'create' | 'patchResource'>>;
  let taskCategoryServiceSpy: Mocked<Pick<CategoryService, 'getAllByUser'>>;
  let notificationServiceSpy: Mocked<Pick<NotificationService, 'showSuccess' | 'showErrors'>>;
  let authServiceSpy: Mocked<Pick<AuthService, 'getUser'>>;

  beforeEach(async () => {
    activatedRouteStub = new ActivatedRouteStub({});
    taskServiceSpy = {
      getByCategoryPrefixAndNumber: vi.fn(),
      create: vi.fn(),
      patchResource: vi.fn(),
    };

    taskCategoryServiceSpy = {
      getAllByUser: vi.fn(),
    };

    notificationServiceSpy = {
      showSuccess: vi.fn(),
      showErrors: vi.fn(),
    };

    authServiceSpy = {
      getUser: vi.fn(),
    };

    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of([]));
    authServiceSpy.getUser.mockReturnValue({ username: 'test-user' } as any);

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
        provideNgxValidationMessages({ messages: {} }),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: CategoryService, useValue: taskCategoryServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    comp = fixture.componentInstance;

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
  });

  it('should create the comp', () => {
    expect(comp).toBeDefined();
  });

  it('should get all user categories', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of([
      new TaskCategory(),
      new TaskCategory()
    ]));

    fixture.detectChanges();

    expect(comp.viewCategories.length).toBe(2);
  });

  it('when NEW task then header is "Create task"', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    activatedRouteStub.setParamMap({});

    fixture.detectChanges();

    expect(comp.formHeader).toBe('Create task');
  });

  it('when NEW task then buttonName is "Create"', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    activatedRouteStub.setParamMap({});

    fixture.detectChanges();

    expect(comp.buttonName).toBe('Create');
  });

  it('when EDIT task then header is "Edit task"', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(of());
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });

    fixture.detectChanges();

    expect(comp.formHeader).toBe('Edit task');
  });

  it('when EDIT task then buttonName is "Save"', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(of());
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });

    fixture.detectChanges();

    expect(comp.buttonName).toBe('Save');
  });

  it('when EDIT task then url should has task param as number task and category prefix', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(of());
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });

    fixture.detectChanges();

    const firstArgAsCategoryPrefix = taskServiceSpy.getByCategoryPrefixAndNumber.mock.calls[0][0];
    const secondArgAsCategoryNumber = taskServiceSpy.getByCategoryPrefixAndNumber.mock.calls[0][1];
    expect(firstArgAsCategoryPrefix).toBe('TEST');
    expect(secondArgAsCategoryNumber).toBe(1);
  });

  it('when EDIT task should get category for this task', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());

    const taskToEdit = new Task();
    vi.spyOn(taskToEdit, 'getRelation').mockReturnValue(
      of(new TaskCategory())
    );
    // const taskToEdit = {
    //   getRelation: vi.fn(<T extends Resource>(): Observable<T> => of({} as T)),
    // };
    // taskToEdit.getRelation.mockReturnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });

    fixture.detectChanges();

    expect(comp.taskForm.get('category').value).toBeDefined();
  });

  it('should navigate to "home" page when get task to EDIT error occurs', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(
      throwError(() => 'An error occurred while getting the task'));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should create task', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    taskServiceSpy.create.mockReturnValue(of(getTestTask()));
    fixture.detectChanges();

    comp.sendForm();

    expect(taskServiceSpy.create).toHaveBeenCalledOnce();
    expect(taskServiceSpy.create.mock.calls[0][0]).toBeDefined();
  });

  it('NEW task should has "new" status', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    taskServiceSpy.create.mockReturnValue(of(getTestTask()));
    fixture.detectChanges();

    comp.sendForm();

    expect(taskServiceSpy.create).toHaveBeenCalledOnce();
    expect(taskServiceSpy.create.mock.calls[0][0].status).toBe(TaskStatus.NEW.code);
  });

  it('after create task should navigate to "home" page', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of([]));
    const newTask = getTestTask();
    taskServiceSpy.create.mockReturnValue(of(newTask));
    fixture.detectChanges();

    comp.sendForm();

    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('after create task should show success notification', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    const newTask = getTestTask();
    taskServiceSpy.create.mockReturnValue(of(newTask));
    fixture.detectChanges();

    comp.sendForm();

    expect(notificationServiceSpy.showSuccess).toHaveBeenCalledOnce();
  });

  it('should update task', fakeAsync(() => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    const taskToEdit = getTestTask();
    taskToEdit.status = TaskStatus.IN_PROGRESS.code;
    vi.spyOn(taskToEdit, 'getRelation').mockReturnValue(of(new TaskCategory()));

    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();
    expect(taskServiceSpy.patchResource.mockReturnValue(of()));

    comp.sendForm();

    expect(taskServiceSpy.patchResource).toHaveBeenCalledOnce();
    expect(taskServiceSpy.patchResource.mock.calls[0][0]).toBeDefined();
  }));

  it('when needTimeManagement is TRUE then totalTime and spentTime are equal or great than 0', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    activatedRouteStub.setParamMap({});
    fixture.detectChanges();
    comp.taskForm.get('spentTime').setValue(null);
    comp.taskForm.get('totalTime').setValue(null);

    comp.taskForm.get('needTimeManagement').setValue(true);

    expect(comp.taskForm.get('totalTime').valid).toBe(false);
    expect(comp.taskForm.get('spentTime').valid).toBe(false);
  });

  it('when needTimeManagement is FALSE then totalTime and spentTime are NOT REQUIRED', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    activatedRouteStub.setParamMap({});
    fixture.detectChanges();
    comp.taskForm.get('spentTime').setValue(null);
    comp.taskForm.get('totalTime').setValue(null);

    comp.taskForm.get('needTimeManagement').setValue(false);

    expect(comp.taskForm.get('totalTime').valid).toBe(true);
    expect(comp.taskForm.get('spentTime').valid).toBe(true);
  });

  it('when need time management is TRUE and auto reduce is FALSE then spent time is ENABLE', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    activatedRouteStub.setParamMap({});
    fixture.detectChanges();

    comp.taskForm.get('needTimeManagement').setValue(true);
    comp.taskForm.get('autoReduce').setValue(false);

    expect(comp.taskForm.get('spentTime').enabled).toBe(true);
  });

  it('when need time management is TRUE  and auto reduce is TRUE then spent time is DISABLE', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    activatedRouteStub.setParamMap({});
    fixture.detectChanges();

    comp.taskForm.get('needTimeManagement').setValue(true);
    comp.taskForm.get('autoReduce').setValue(true);

    expect(comp.taskForm.get('spentTime').disabled).toBe(true);
  });

  it('when need time management is TRUE and auto reduce is FALSE then spent time is REQUIRED', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    activatedRouteStub.setParamMap({});
    fixture.detectChanges();
    comp.taskForm.get('spentTime').setValue(null);

    comp.taskForm.get('needTimeManagement').setValue(true);
    comp.taskForm.get('autoReduce').setValue(false);

    expect(comp.taskForm.get('spentTime').valid).toBe(false);
  });

  it('should disable needTimeManagement and autoReduce checkbox when task in "IN_PROGRESS" status', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    const taskToEdit = getTestTask();
    taskToEdit.status = TaskStatus.IN_PROGRESS.code;
    vi.spyOn(taskToEdit, 'getRelation').mockReturnValue(of(new TaskCategory()));

    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();

    expect(comp.taskForm.get('needTimeManagement').disabled).toBe(true);
    expect(comp.taskForm.get('autoReduce').disabled).toBe(true);
  });

  it('should disable needTimeManagement and autoReduce checkbox when task in "COMPLETED" status', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    const taskToEdit = getTestTask();
    taskToEdit.status = TaskStatus.COMPLETED.code;
    vi.spyOn(taskToEdit, 'getRelation').mockReturnValue(of(new TaskCategory()));

    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();

    expect(comp.taskForm.get('needTimeManagement').disabled).toBe(true);
    expect(comp.taskForm.get('autoReduce').disabled).toBe(true);
  });

  it('should disable needTimeManagement and autoReduce checkbox when task in "CANCELED" status', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    const taskToEdit = getTestTask();
    taskToEdit.status = TaskStatus.CANCELED.code;
    vi.spyOn(taskToEdit, 'getRelation').mockReturnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();

    expect(comp.taskForm.get('needTimeManagement').disabled).toBe(true);
    expect(comp.taskForm.get('autoReduce').disabled).toBe(true);
  });

  it('should disable needTimeManagement and autoReduce checkbox when task in "NOT_COMPLETED" status', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    const taskToEdit = getTestTask();
    taskToEdit.status = TaskStatus.NOT_COMPLETED.code;
    vi.spyOn(taskToEdit, 'getRelation').mockReturnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();

    expect(comp.taskForm.get('needTimeManagement').disabled).toBe(true);
    expect(comp.taskForm.get('autoReduce').disabled).toBe(true);
  });

  it('should show extra tooltip when autoReduce is DISABLE', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    const taskToEdit = getTestTask();
    taskToEdit.status = TaskStatus.NOT_COMPLETED.code;
    vi.spyOn(taskToEdit, 'getRelation').mockReturnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();
    const templateHelper = new TemplateHelper(fixture);

    expect(comp.taskForm.get('autoReduce').disabled).toBe(true);
    expect(templateHelper.query('task_form__tooltip task_form__tooltip_extra')).toBeDefined();
  });

  it('should show extra tooltip when needTimeManagement is DISABLE', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    const taskToEdit = getTestTask();
    taskToEdit.status = TaskStatus.NOT_COMPLETED.code;
    vi.spyOn(taskToEdit, 'getRelation').mockReturnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();
    const templateHelper = new TemplateHelper(fixture);

    expect(comp.taskForm.get('needTimeManagement').disabled).toBe(true);
    expect(templateHelper.query('task_form__tooltip task_form__tooltip_extra')).toBeDefined();
  });

  it('after success update task status should be success message', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    const taskToEdit = getTestTask();
    taskToEdit.status = TaskStatus.NOT_COMPLETED.code;
    vi.spyOn(taskToEdit, 'getRelation').mockReturnValue(of(new TaskCategory()));
    const updatedTask = { ...taskToEdit, status: TaskStatus.IN_PROGRESS.code };
    vi.spyOn(taskToEdit, 'postRelation').mockReturnValue(of(updatedTask));

    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(of(taskToEdit));

    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();

    comp.onChangeStatus(TaskStatus.IN_PROGRESS);

    expect(notificationServiceSpy.showErrors).not.toHaveBeenCalled();
    expect(notificationServiceSpy.showSuccess).toHaveBeenCalledOnce();
  });

  it('after fail update task status should be failed message', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    const taskToEdit = getTestTask();
    taskToEdit.status = TaskStatus.NOT_COMPLETED.code;
    vi.spyOn(taskToEdit, 'getRelation').mockReturnValue(of(new TaskCategory()));
    vi.spyOn(taskToEdit, 'postRelation').mockReturnValue(throwError(() => 'Error occurs while update task '));

    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(of(taskToEdit));

    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });
    fixture.detectChanges();

    comp.onChangeStatus(TaskStatus.IN_PROGRESS);

    expect(notificationServiceSpy.showErrors).toHaveBeenCalledOnce();
    expect(notificationServiceSpy.showSuccess).not.toHaveBeenCalled();
  });

  it('task status component should be hidden for new task', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    activatedRouteStub.setParamMap({});

    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    expect(templateHelper.query('tm-task-status')).toBeNull();
  });

  it('task status component should be visible when edit task', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    const taskToEdit = getTestTask();
    taskToEdit.status = TaskStatus.IN_PROGRESS.code;
    vi.spyOn(taskToEdit, 'getRelation').mockReturnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });

    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    expect(templateHelper.query('tm-task-status')).toBeDefined();
  });

  it('needTimeManagement ui element should be hidden for new task', () => {
    activatedRouteStub.setParamMap({});
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());

    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    expect(templateHelper.query('.task_form__need_time_management')).toBeNull();
  });

  it('needTimeManagement ui element should be visible when edit task', () => {
    taskCategoryServiceSpy.getAllByUser.mockReturnValue(of());
    const taskToEdit = getTestTask();
    taskToEdit.status = TaskStatus.IN_PROGRESS.code;
    vi.spyOn(taskToEdit, 'getRelation').mockReturnValue(of(new TaskCategory()));
    taskServiceSpy.getByCategoryPrefixAndNumber.mockReturnValue(of(taskToEdit));
    activatedRouteStub.setParamMap({
      taskCategoryNumber: 'TEST-1'
    });

    fixture.detectChanges();

    const templateHelper = new TemplateHelper(fixture);
    expect(templateHelper.query('.task_form__need_time_management')).toBeDefined();
  });

});
