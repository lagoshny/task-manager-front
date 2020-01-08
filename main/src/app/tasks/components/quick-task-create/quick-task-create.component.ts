import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { timer } from 'rxjs';
import { TaskPriority } from '../../../core/models/constants/task-priority.items';
import { TaskStatus } from '../../../core/models/constants/task-status.items';
import { Task } from '../../../core/models/task.model';
import { StringUtils } from '../../../core/utils/string.utils';
import { TaskService } from '../../services/task.service';

@Component({
    selector: 'tm-quick-task-create',
    templateUrl: './quick-task-create.component.html',
    styleUrls: ['./quick-task-create.component.scss']
})
export class QuickTaskCreateComponent implements OnInit {

    @Output()
    public readonly newTask = new EventEmitter<Task>();

    public quickTaskForm: FormGroup;

    public needShowError = false;

    constructor(private formBuilder: FormBuilder,
                private taskService: TaskService) {
    }

    public ngOnInit(): void {
        this.quickTaskForm = this.buildForm();
    }

    public onEnter(): void {
        this.createTask();
    }

    public onClick(): void {
        this.createTask();
    }

    private createTask(): void {
        const taskNameControl = this.quickTaskForm.get('name');
        if (_.isUndefined(taskNameControl) || _.isEmpty(taskNameControl.value)) {
            this.showError();
            return;
        }

        const task = new Task();
        task.name = taskNameControl.value;
        task.creationDate = moment().toDate();
        task.priority = TaskPriority.MIDDLE.code;
        task.status = TaskStatus.NEW.code;

        this.taskService.create(task).subscribe((t: Task) => {
            taskNameControl.setValue(StringUtils.EMPTY);
            this.newTask.emit(t);
        });
    }

    private buildForm(): FormGroup {
        return this.formBuilder.group({
            name: StringUtils.EMPTY
        });
    }

    private showError(): void {
        this.needShowError = true;
        timer(3000).subscribe(() => {
            this.needShowError = false;
        });
    }

}
