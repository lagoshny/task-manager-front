import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TaskPriority } from '../../../core/models/constants/task-priority.items';
import { TaskStatus } from '../../../core/models/constants/task-status.items';
import { Task } from '../../../core/models/task.model';
import { TemplateHelper } from '../../../utils/template.helper';
import { TaskService } from '../../services/task.service';
import { QuickTaskCreateComponent } from './quick-task-create.component';
import { provideNgxValidationMessages } from '@lagoshny/ngx-validation-messages';

describe('QuickTaskCreateComponent', () => {
  let fixture: ComponentFixture<QuickTaskCreateComponent>;
  let comp: QuickTaskCreateComponent;
  let taskServiceSpy: any;
  let templateHelper: TemplateHelper<QuickTaskCreateComponent>;

  beforeEach(waitForAsync(() => {
    taskServiceSpy = {
      create: jasmine.createSpy('create')
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
      ],
      declarations: [
        QuickTaskCreateComponent
      ],
      providers: [
        provideNgxValidationMessages({
          messages: {}
        }),
        {provide: TaskService, useValue: taskServiceSpy}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(QuickTaskCreateComponent);
        comp = fixture.componentInstance;
        templateHelper = new TemplateHelper<QuickTaskCreateComponent>(fixture);
      });
  }));

  it('should create the comp', () => {
    expect(comp).toBeTruthy();
  });

  it('should show error when task name is empty', () => {
    fixture.detectChanges();
    const template = new TemplateHelper(fixture);
    const createTaskButton = template.query<HTMLButtonElement>('.quick_task_create_input_button');
    createTaskButton.click();

    fixture.detectChanges();

    expect(comp.needShowError).toBeTruthy();
    expect(template.query('ngx-validation-messages')).toBeDefined();
  });

  it('should create task with name', () => {
    fixture.detectChanges();

    createTaskByButton();

    fixture.detectChanges();
    expect(taskServiceSpy.create.calls.count()).toBe(1);
  });

  it('new task should be in NEW status', () => {
    fixture.detectChanges();

    createTaskByButton();

    fixture.detectChanges();

    const taskToCreate = taskServiceSpy.create.calls.argsFor(0)[0] as Task;
    expect(taskToCreate.status).toBe(TaskStatus.NEW.code);
  });


  it('new task should has middle priority', () => {
    fixture.detectChanges();

    createTaskByButton();

    fixture.detectChanges();

    const taskToCreate = taskServiceSpy.create.calls.argsFor(0)[0] as Task;
    expect(taskToCreate.priority).toBe(TaskPriority.MIDDLE.code);
  });

  it('after create task task name field should be empty', () => {
    fixture.detectChanges();

    createTaskByButton();

    fixture.detectChanges();

    const taskNameInput = templateHelper.query<HTMLInputElement>('.quick_task_create_input');
    expect(taskNameInput.textContent).toBe('');
  });

  function createTaskByButton(): void {
    comp.quickTaskForm.patchValue({name: 'Test task'});
    taskServiceSpy.create.and.returnValue(of(new Task()));
    const createTaskButton = templateHelper.query<HTMLButtonElement>('.quick_task_create_input_button');
    createTaskButton.click();
  }

});
