import { Component, Input } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxValidationMessagesModule } from '@lagoshny/ngx-validation-messages';
import { NGXLogger, NGXLoggerMock } from 'ngx-logger';
import { of, throwError } from 'rxjs';
import { CoreModule } from '../../../core/core.module';
import { TaskStatus } from '../../../core/models/constants/task-status.items';
import { TaskCategory } from '../../../core/models/task-category.model';
import { Task } from '../../../core/models/task.model';
import { ActivatedRouteStub } from '../../../test/activated-route-stub';
import { TaskCategoryService } from '../../services/task-category.service';
import { TaskService } from '../../services/task.service';
import { getTestTask } from '../test.helper';
import { TaskFormComponent } from './task-form.component';

@Component({
    selector: 'tm-task-status-changer',
    template: ''
})
export class TaskStatusChangerComponent {
    @Input()
    public task: Task;
}

describe('TaskFormComponent', () => {
    let fixture: ComponentFixture<TaskFormComponent>;
    let comp: TaskFormComponent;
    let routerSpy: any;
    let activatedRouteStub: ActivatedRouteStub;
    let taskServiceSpy: any;
    let taskCategoryServiceSpy: any;

    beforeEach(async(() => {
        routerSpy = {
            navigate: jasmine.createSpy('navigate')
        };
        activatedRouteStub = new ActivatedRouteStub({});
        taskServiceSpy = {
            getByCategoryPrefixAndNumber: jasmine.createSpy('getByCategoryPrefixAndNumber'),
            create: jasmine.createSpy('create'),
            patch: jasmine.createSpy('patch')
        };
        taskCategoryServiceSpy = {
            getAllByUser: jasmine.createSpy('getAllByUser')
        };

        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                BrowserAnimationsModule,
                ReactiveFormsModule,
                MatAutocompleteModule,
                MatSelectModule,
                MatDatepickerModule,
                MatCheckboxModule,
                MatButtonModule,
                MatInputModule,
                NgxValidationMessagesModule.forRoot({
                    messages: {}
                })
            ],
            declarations: [
                TaskStatusChangerComponent,
                TaskFormComponent
            ],
            providers: [
                {provide: Router, useValue: routerSpy},
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: NGXLogger, useClass: NGXLoggerMock},
                {provide: TaskService, useValue: taskServiceSpy},
                {provide: TaskCategoryService, useValue: taskCategoryServiceSpy}
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(TaskFormComponent);
                comp = fixture.componentInstance;
            });
    }));

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
        routerSpy.navigate.and.returnValue(Promise.resolve());
        taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
        taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(throwError("An error occurred while getting the task"));
        activatedRouteStub.setParamMap({
            taskCategoryNumber: 'TEST-1'
        });

        fixture.detectChanges();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
    });

    it('should create task', () => {
        routerSpy.navigate.and.returnValue(Promise.resolve());
        taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
        taskServiceSpy.create.and.returnValue(of(new Task()));
        fixture.detectChanges();

        comp.sendForm();

        expect(taskServiceSpy.create.calls.count()).toBe(1);
        expect(taskServiceSpy.create.calls.argsFor(0)[0]).toBeDefined();
    });

    it('NEW task should has "new" status', () => {
        routerSpy.navigate.and.returnValue(Promise.resolve());
        taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
        taskServiceSpy.create.and.returnValue(of(new Task()));
        fixture.detectChanges();

        comp.sendForm();

        expect(taskServiceSpy.create.calls.count()).toBe(1);
        expect(taskServiceSpy.create.calls.argsFor(0)[0].status).toBe(TaskStatus.NEW.code);
    });

    it('after create task should navigate to "home" page', () => {
        routerSpy.navigate.and.returnValue(Promise.resolve());
        taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
        taskServiceSpy.create.and.returnValue(of(new Task()));
        fixture.detectChanges();

        comp.sendForm();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
    });

    it('should update task', fakeAsync(() => {
        taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
        const taskToEdit = {
            ...getTestTask(),
            getRelation: jasmine.createSpy('getRelation')
        };
        taskToEdit.getRelation.and.returnValue(of(new TaskCategory()));
        taskServiceSpy.getByCategoryPrefixAndNumber.and.returnValue(of(taskToEdit));
        activatedRouteStub.setParamMap({
            taskCategoryNumber: 'TEST-1'
        });
        fixture.detectChanges();
        expect(taskServiceSpy.patch.and.returnValue(of()));

        comp.sendForm();

        expect(taskServiceSpy.patch.calls.count()).toBe(1);
        expect(taskServiceSpy.patch.calls.argsFor(0)[0]).toBeDefined();
    }));

    it('when needTimeManagement is TRUE then totalTime and spentTime are equal or great than 0', () => {
        taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
        activatedRouteStub.setParamMap({});
        fixture.detectChanges();
        comp.taskForm.get('spentTime').setValue(null);
        comp.taskForm.get('totalTime').setValue(null);

        comp.taskForm.get('needTimeManagement').setValue(true);

        expect(comp.taskForm.get('totalTime').valid).toBeFalsy();
        expect(comp.taskForm.get('spentTime').valid).toBeFalsy();
    });

    it('when needTimeManagement is FALSE then totalTime and spentTime are NOT REQUIRED', () => {
        taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
        activatedRouteStub.setParamMap({});
        fixture.detectChanges();
        comp.taskForm.get('spentTime').setValue(null);
        comp.taskForm.get('totalTime').setValue(null);

        comp.taskForm.get('needTimeManagement').setValue(false);

        expect(comp.taskForm.get('totalTime').valid).toBeTruthy();
        expect(comp.taskForm.get('spentTime').valid).toBeTruthy();
    });

    it('when need time management is TRUE and auto reduce is FALSE then spent time is ENABLE', () => {
        taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
        activatedRouteStub.setParamMap({});
        fixture.detectChanges();

        comp.taskForm.get('needTimeManagement').setValue(true);
        comp.taskForm.get('autoReduce').setValue(false);

        expect(comp.taskForm.get('spentTime').enabled).toBeTruthy();
    });

    it('when need time management is TRUE  and auto reduce is TRUE then spent time is DISABLE', () => {
        taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
        activatedRouteStub.setParamMap({});
        fixture.detectChanges();

        comp.taskForm.get('needTimeManagement').setValue(true);
        comp.taskForm.get('autoReduce').setValue(true);

        expect(comp.taskForm.get('spentTime').disabled).toBeTruthy();
    });

    it('when need time management is TRUE and auto reduce is FALSE then spent time is REQUIRED', () => {
        taskCategoryServiceSpy.getAllByUser.and.returnValue(of());
        activatedRouteStub.setParamMap({});
        fixture.detectChanges();
        comp.taskForm.get('spentTime').setValue(null);

        comp.taskForm.get('needTimeManagement').setValue(true);
        comp.taskForm.get('autoReduce').setValue(false);

        expect(comp.taskForm.get('spentTime').valid).toBeFalsy();
    });

});