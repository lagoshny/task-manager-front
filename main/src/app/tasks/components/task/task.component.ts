import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { timer } from 'rxjs/internal/observable/timer';
import { TaskStatus } from '../../../core/models/constants/task-status.items';
import { TaskTimeStatus } from '../../../core/models/constants/task-time-status.const';
import { Task } from '../../../core/models/task.model';
import { DateUtils } from '../../../core/utils/date.utils';

@Component({
    selector: 'tm-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {

    @Input()
    public task: Task;

    @Output()
    public readonly clickTask = new EventEmitter<Task>();

    @Output()
    public readonly removeTask = new EventEmitter<Task>();

    public totalMinutesAsString: string;

    public leftTimeAsString: string;

    public priorityClassName: string;

    public statusClassName: string;

    private prefixPriorityClassName = 'task__priority_';

    private prefixStatusClassName = 'task__status_';

    private updateLeftTimeSubscription: Subscription;


    public ngOnInit(): void {
        this.totalMinutesAsString = this.task.totalTime
            ? DateUtils.getMinutesAsString(this.task.totalTime)
            : 'without time management';
        this.task.leftTime = this.calculateLeftTime();
        this.leftTimeAsString = this.getLeftTimeAsString(this.task.leftTime);
        if (this.task.autoReduce) {
            if (TaskStatus.isProgress(this.task.status)) {
                this.updateLeftTimeSubscription = timer(0, 60 * 1000)
                    .subscribe(() => {
                        this.task.leftTime = this.calculateLeftTime();
                        this.leftTimeAsString = this.getLeftTimeAsString(this.task.leftTime);
                    });
            } else {
                if (this.updateLeftTimeSubscription) {
                    this.updateLeftTimeSubscription.unsubscribe();
                }
            }
        }

        this.priorityClassName = this.prefixPriorityClassName + (this.task.priority as string).toLowerCase();
        this.statusClassName = this.prefixStatusClassName + TaskStatus.getByName(this.task.status).className;
    }

    public ngOnDestroy(): void {
        if (this.updateLeftTimeSubscription) {
            this.updateLeftTimeSubscription.unsubscribe();
        }
    }

    public onClickTask(): void {
        this.clickTask.emit(this.task);
    }

    private calculateLeftTime(): number {
        if (!this.task.needTimeManagement || TaskStatus.isNew(this.task.status)
            || TaskStatus.isCompleted(this.task.status)) {
            return -1;
        }

        if (this.task.autoReduce && TaskStatus.isProgress(this.task.status)) {
            return Math.ceil(moment.duration(moment(this.task.startedDate)
                .add(this.task.totalTime, 'minutes')
                .diff(moment()))
                .asMinutes());
        } else {
            return Math.trunc(this.task.totalTime - this.task.spentTime);
        }
    }

    private getLeftTimeAsString(leftTime: number): string {
        if (!this.task.needTimeManagement) {
            return TaskTimeStatus.WITHOUT_TIME;
        }

        if (TaskStatus.isNew(this.task.status)) {
            return TaskTimeStatus.NOT_WORK;
        } else if (TaskStatus.isCompleted(this.task.status)) {
            return TaskTimeStatus.SUCCESS;
        } else {
            if (leftTime <= 0) {
                return TaskTimeStatus.TIME_IS_OVER;
            } else {
                return DateUtils.getMinutesAsString(leftTime);
            }
        }
    }

}
