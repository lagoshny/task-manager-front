import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskStatus } from '../../../core/models/constants/task-status.items';

@Component({
    selector: 'tm-task-status-changer',
    templateUrl: './task-status-changer.component.html',
    styleUrls: ['./task-status-changer.component.scss']
})
export class TaskStatusChangerComponent {

    @Input()
    public status: string;

    @Output()
    public statusChanged = new EventEmitter<TaskStatus>();

    public availableStatuses = TaskStatus;

}