import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskStatus } from '../../../core/models/constants/task-status.items';
import { Task } from '../../../core/models/task.model';
import { getTestTask } from '../test.helper';
import { TaskComponent } from './task.component';

@Component({
    selector: 'tm-time-icon',
    template: ''
})
class TimeIconComponent {
    @Input()
    private totalTime: number;
    @Input()
    private leftTime: number;
    @Input()
    private status: string;
}

describe('TaskComponent', () => {
    let fixture: ComponentFixture<TaskComponent>;
    let comp: TaskComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TaskComponent,
                TimeIconComponent
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(TaskComponent);
                comp = fixture.componentInstance;
            })
    }));

    it('should create the comp', () => {
        expect(comp).toBeTruthy();
    });

    it('should be without time management when total time is undefined', () => {
        const task = getTestTask();
        task.totalTime = 0;
        comp.task = task;

        fixture.detectChanges();

        expect(comp.totalMinutesAsString).toBe('without time management');
    });

    it('should be with time management when total time is defined', () => {
        const task = getTestTask();
        task.totalTime = 10;
        comp.task = task;

        fixture.detectChanges();

        expect(comp.totalMinutesAsString).toBe('10 minutes');
    });

    it('should emit clickTask when click by task', () => {
        const task = getTestTask();
        let selectedTask = undefined;
        comp.task = task;

        fixture.detectChanges();
        comp.clickTask.subscribe((task: Task) => {
            selectedTask = task;
        });
        comp.onClickTask();

        expect(task).toBe(selectedTask);
    });

    it('left time should be -1 when task is new', () => {
        const task = getTestTask();
        task.status = TaskStatus.NEW.name;
        task.needTimeManagement = true;
        task.totalTime = 10;
        task.spentTime = 5;
        comp.task = task;

        fixture.detectChanges();

        expect(comp.task.leftTime).toBe(-1);
    });

    it('left time should be -1 when task is completed', () => {
        const task = getTestTask();
        task.status = TaskStatus.COMPLETED.name;
        task.needTimeManagement = true;
        task.totalTime = 10;
        task.spentTime = 5;
        comp.task = task;

        fixture.detectChanges();

        expect(comp.task.leftTime).toBe(-1);
    });

    it('left time should be great than 0 when task in progress', () => {
        const task = getTestTask();
        task.status = TaskStatus.IN_PROGRESS.name;
        task.needTimeManagement = true;
        task.totalTime = 10;
        task.spentTime = 5;
        comp.task = task;

        fixture.detectChanges();

        expect(comp.task.leftTime).toBeGreaterThan(0);
    });

    it('left time as string should be \'without time\' when needTimeManagement is false', () => {
        const task = getTestTask();
        task.needTimeManagement = false;
        comp.task = task;

        fixture.detectChanges();

        expect(comp.leftTimeAsString).toBe('without time');
    });

    it('left time as string should be \'not started\' when task in new status', () => {
        const task = getTestTask();
        task.status = TaskStatus.NEW.name;
        task.needTimeManagement = true;
        comp.task = task;

        fixture.detectChanges();

        expect(comp.leftTimeAsString).toBe('not started');
    });

    it('left time as string should be \'completed\' when task in completed status', () => {
        const task = getTestTask();
        task.status = TaskStatus.COMPLETED.name;
        task.needTimeManagement = true;
        comp.task = task;

        fixture.detectChanges();

        expect(comp.leftTimeAsString).toBe('completed');
    });

    it('left time as string should be \'expired\' when left time less than 0', () => {
        const task = getTestTask();
        task.status = TaskStatus.IN_PROGRESS.name;
        task.needTimeManagement = true;
        task.totalTime = 5;
        task.spentTime = 5;
        comp.task = task;

        fixture.detectChanges();

        expect(comp.leftTimeAsString).toBe('expired');
    });

    it('left time as string should be great than 0 when left time more than 0', () => {
        const task = getTestTask();
        task.status = TaskStatus.IN_PROGRESS.name;
        task.needTimeManagement = true;
        task.totalTime = 15;
        task.spentTime = 5;
        comp.task = task;

        fixture.detectChanges();

        expect(comp.leftTimeAsString).toBe('10 minutes');
    });

});