import { Component, Input } from '@angular/core';
import { TaskStatus } from '../../../core/models/constants/task-status.items';
import { Task } from '../../../core/models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
    selector: 'tm-task-status-changer',
    templateUrl: './task-status-changer.component.html',
    styleUrls: ['./task-status-changer.component.scss']
})
export class TaskStatusChangerComponent {

    @Input()
    public task: Task;

    public availableStatuses = TaskStatus;

    constructor(private taskService: TaskService) {
    }

    public changeStatus(status: TaskStatus) {

    }

}