import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskStatus } from '../../../core/models/constants/task-status.items';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'tm-task-status',
  templateUrl: './task-status.component.html',
  standalone: true,
  imports: [
    MatButton,
  ]
})
export class TaskStatusComponent {

  @Input()
  public status: string;

  @Output()
  public changeStatus = new EventEmitter<TaskStatus>();

  public availableStatuses = TaskStatus;

}
