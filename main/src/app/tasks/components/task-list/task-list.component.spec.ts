import { Component, EventEmitter, Input, Output } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourcePage } from '@lagoshny/ngx-hal-client';
import { NGXLogger, NGXLoggerMock } from 'ngx-logger';
import { of } from 'rxjs';
import { Task } from '../../../core/models/task.model';
import { ActivatedRouteStub } from '../../../test/activated-route-stub';
import { TemplateHelper } from '../../../test/template.helper';
import { TaskService } from '../../services/task.service';
import { getTestTask } from '../test.helper';
import { TaskListComponent } from './task-list.component';

@Component({
    selector: 'tm-quick-task-create',
    template: `<div class="task-add" (click)="afterAddedTask.emit()"></div>`
})
class QuickTaskCreateComponent {
    @Output()
    public readonly afterAddedTask = new EventEmitter<Task>();
}

@Component({
    selector: 'tm-task',
    template: `<div class="task-select" (click)="clickTask.emit(task)"></div>
                <div class="task__remove_button" (click)="removeTask.emit(task)"></div>`
})
class TaskComponent {
    @Input()
    private task: Task;
    @Output()
    public readonly clickTask = new EventEmitter<Task>();
    @Output()
    public readonly removeTask = new EventEmitter<Task>();
}

describe('TaskListComponent', () => {

    let fixture: ComponentFixture<TaskListComponent>;
    let comp: TaskListComponent;
    let routerSpy: any;
    let activatedRouteStub: any;
    let taskServiceSpy: any;

    beforeEach(async(() => {
        routerSpy = {
            navigate: jasmine.createSpy('navigate')
        };
        activatedRouteStub = new ActivatedRouteStub({});
        taskServiceSpy = {
            delete: jasmine.createSpy('delete'),
            getAllUserTasks: jasmine.createSpy('getAllUserTasks')
        };

        TestBed.configureTestingModule({
            declarations: [
                QuickTaskCreateComponent,
                TaskComponent,
                TaskListComponent
            ],
            providers: [
                {provide: Router, useValue: routerSpy},
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: NGXLogger, useClass: NGXLoggerMock},
                {provide: TaskService, useValue: taskServiceSpy}
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(TaskListComponent);
                comp = fixture.componentInstance;
            })
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
        let testTask = getTestTask();
        testTask.category.prefix = 'test';
        testTask.number = 1;
        let resourcePage = new ResourcePage();
        resourcePage.resources = [testTask];

        taskServiceSpy.getAllUserTasks.and.returnValue(of(resourcePage));
        routerSpy.navigate.and.returnValue(Promise.resolve());

        fixture.detectChanges();

        let templateHelper = new TemplateHelper(fixture);
        let taskComp = templateHelper.query<HTMLDivElement>('.task-select');

        taskComp.click();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['tasks/edit', 'test-1']);
    });

    it('should hide tasks list when minimize is TRUE', () => {
        let resourcePage = new ResourcePage();
        resourcePage.resources = [new Task()];
        taskServiceSpy.getAllUserTasks.and.returnValue(of(resourcePage));
        fixture.detectChanges();

        comp.onMinimizeTasks();
        fixture.detectChanges();

        let templateHelper = new TemplateHelper(fixture);
        expect(templateHelper.query('tm-quick-task-create')).toBeNull();
        expect(templateHelper.query('tm-task')).toBeNull();
        expect(templateHelper.query('.task-list__minimize_button__icon .fa-eye')).toBeDefined();
    });

    it('should show tasks list when minimize is FALSE', () => {
        let resourcePage = new ResourcePage();
        resourcePage.resources = [new Task()];
        taskServiceSpy.getAllUserTasks.and.returnValue(of(resourcePage));
        fixture.detectChanges();

        comp.onMinimizeTasks();
        fixture.detectChanges();

        let templateHelper = new TemplateHelper(fixture);
        expect(templateHelper.query('tm-quick-task-create')).toBeDefined();
        expect(templateHelper.query('tm-task')).toBeDefined();
        expect(templateHelper.query('.task-list__minimize_button__icon .fa-eye-slash')).toBeDefined();
    });

    it('should delete task when click by delete button', () => {
        let resourcePage = new ResourcePage();
        resourcePage.resources = [new Task()];
        taskServiceSpy.getAllUserTasks.and.returnValue(of(resourcePage));
        taskServiceSpy.delete.and.returnValue(of());
        fixture.detectChanges();

        let templateHelper = new TemplateHelper(fixture);
        let removeTaskButton = templateHelper.query<HTMLDivElement>('.task__remove_button');

        removeTaskButton.click();

        expect(taskServiceSpy.delete.calls.count()).toBe(1);
    });

    it('should update task list after added new one', () => {
        let resourcePage = new ResourcePage();
        resourcePage.resources = [new Task()];
        taskServiceSpy.getAllUserTasks.and.returnValue(of(resourcePage));
        fixture.detectChanges();

        let templateHelper = new TemplateHelper(fixture);
        let quickTaskCreateEl = templateHelper.query<HTMLElement>('.task-add');

        quickTaskCreateEl.click();

        expect(taskServiceSpy.getAllUserTasks.calls.count()).toBe(2);
    });

});