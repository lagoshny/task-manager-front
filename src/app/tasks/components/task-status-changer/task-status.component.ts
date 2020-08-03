import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskStatus } from '../../../core/models/constants/task-status.items';

@Component({
  selector: 'tm-task-status',
  templateUrl: './task-status.component.html'
})
export class TaskStatusComponent {

  @Input()
  public status: string;

  @Output()
  public changeStatus = new EventEmitter<TaskStatus>();

  public availableStatuses = TaskStatus;

}
