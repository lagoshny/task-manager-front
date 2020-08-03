import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { isString } from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { ServerApi } from '../../../app.config';
import {
    changeHeightAnimation,
    dropDownAnimation,
    showSectionAnimation
} from '../../../core/animations/common.animation';
import { TaskPriority } from '../../../core/models/constants/task-priority.items';
import { TaskStatus } from '../../../core/models/constants/task-status.items';
import { TaskCategory } from '../../../core/models/task-category.model';
import { Task } from '../../../core/models/task.model';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CustomValidators } from '../../../core/validation/custom.validators';
import { CategoryService } from '../../services/category.service';
import { TaskService } from '../../services/task.service';
import { TaskUtils } from '../../utils/task.utils';

@Component({
    selector: 'tm-task-form',
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.scss'],
    animations: [
        dropDownAnimation,
        showSectionAnimation,
        changeHeightAnimation
    ]
})
export class TaskFormComponent implements OnInit, OnDestroy {

    public taskForm: FormGroup;

    public formHeader = 'Create task';
    public buttonName = 'Create';

    public viewCategories: Array<TaskCategory> = [];

    public filteredCategories: Observable<Array<TaskCategory>>;

    public taskPriorities: Array<TaskPriority> = TaskPriority.getAll();

    public showTimeSection = false;

    private taskToEdit: Task;

    private subs: Array<Subscription> = [];

    constructor(public router: Router,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private logger: NGXLogger,
                private notificationService: NotificationService,
                private authService: AuthService,
                private taskService: TaskService,
                private categoryService: CategoryService) {
    }

    public ngOnInit(): void {
        this.buildForm();
        this.watchValueChanges();
        this.loadUserCategories();
        const taskCategoryNumber = this.activatedRoute.snapshot.paramMap.get('taskCategoryNumber');
        if (taskCategoryNumber) {
            this.formHeader = 'Edit task';
            this.buttonName = 'Save';
            const taskParam = taskCategoryNumber.split("-");
            const categoryPrefix = taskParam[0];
            const number = _.toNumber(taskParam[1]);
            this.subs.push(
                this.taskService.getByCategoryPrefixAndNumber(categoryPrefix, number)
                    .subscribe((task: Task) => {
                        task.getRelation(TaskCategory, ServerApi.TASKS.relations.taskCategory)
                            .subscribe((taskCategory: TaskCategory) => {
                                task.category = taskCategory;
                                this.taskForm.patchValue({
                                    ...task,
                                    priority: TaskPriority.getByCode(task.priority),
                                    status: TaskStatus.getByCode(task.status).name,
                                    spentTime: TaskUtils.calculateSpentTime(task)
                                });
                                this.taskToEdit = task;
                            });
                    }, () => {
                        this.router.navigate(['home'])
                            .catch(reason => this.logger.error(reason));
                    })
            )
        }
    }

    public ngOnDestroy(): void {
        this.subs.forEach((sub: Subscription) => {
            sub.unsubscribe();
        })
    }

    public sendForm(): void {
        const taskFromForm = this.taskForm.getRawValue() as Task;
        taskFromForm.priority = (this.taskForm.get('priority').value as TaskPriority).code;
        taskFromForm.status = TaskStatus.getByName(this.taskForm.get('status').value).code;
        taskFromForm.author = this.authService.getUser();

        if (this.taskToEdit) {
            const task = _.merge(this.taskToEdit, taskFromForm);
            this.subs.push(
                this.taskService.patch(task).subscribe((/* updatedTask: Task */) => {
                    this.router.navigate(['home'])
                        .catch(reason => this.logger.error(reason));
                })
            );
        } else {
            taskFromForm.status = TaskStatus.NEW.code;
            taskFromForm.creationDate = new Date();
            this.subs.push(
                this.taskService.create(taskFromForm).subscribe((createdTask: Task) => {
                    this.notificationService.showSuccess(['Task successfully created']);
                    this.router.navigate(['tasks/edit', `${createdTask.category.prefix}-${createdTask.number}`])
                        .catch(reason => this.logger.error(reason));
                })
            );
        }
    }

    public displayCategory(category?: TaskCategory): string | undefined {
        return category ? category.name : undefined;
    }

    public onChangeStatus(status: TaskStatus): void {
        this.taskToEdit.postRelation('updateStatus', {
                status: status.code
            }
        ).subscribe((updatedTask: Task) => {
            this.taskToEdit = updatedTask;
            this.taskForm.patchValue({
                status: TaskStatus.getByCode(updatedTask.status).name
            });
            this.notificationService.showSuccess([`Task status changed to '${status.name}'`]);
        }, () => {
            this.notificationService.showErrors([`An error occurred while changing the task status '${status.name}'`]);
        });
    }

    public getStatusColor(): string {
        return TaskStatus.getByName(this.taskForm.get('status').value).color;
    }

    private buildForm(): void {
        this.taskForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(255)]],
            status: [{value: TaskStatus.NEW.name, disabled: true}],
            category: ['', Validators.required],
            description: ['', Validators.maxLength(255)],
            priority: ['', Validators.required],
            needTimeManagement: [{value: false, disabled: true}],
            totalTime: [0, [Validators.min(0), CustomValidators.number]],
            spentTime: [0, [Validators.min(0), CustomValidators.number]],
            autoReduce: false
        });
    }

    private loadUserCategories(): void {
        this.subs.push(
            this.categoryService.getAllByUser()
                .subscribe((categories: Array<TaskCategory>) => {
                    this.viewCategories = categories;
                    this.filteredCategories = this.taskForm.get('category').valueChanges
                        .pipe(
                            map((value: TaskCategory | string) => isString(value) ? value : value.name),
                            filter((name: string) => this.taskToEdit
                                && this.taskToEdit.category
                                && name != this.taskToEdit.category.name),
                            startWith(''),
                            map((name: string) => name ? this._filter(name) : this.viewCategories.slice())
                        );
                })
        );
    }

    private watchValueChanges(): void {
        this.subs.push(
            this.taskForm.get('needTimeManagement').valueChanges
                .subscribe((value: boolean) => {
                    this.showTimeSection = value;
                    if (!this.showTimeSection) {
                        this.taskForm.patchValue({
                            totalTime: '',
                            spentTime: '',
                            autoReduce: false
                        });
                        this.taskForm.get('totalTime').clearValidators();
                        this.taskForm.get('totalTime').updateValueAndValidity();
                        this.taskForm.get('spentTime').clearValidators();
                        this.taskForm.get('spentTime').updateValueAndValidity();
                    } else {
                        this.taskForm.get('spentTime').setValidators([Validators.required, Validators.min(0)]);
                        this.taskForm.get('spentTime').updateValueAndValidity();
                        this.taskForm.get('totalTime').setValidators([Validators.required, Validators.min(0)]);
                        this.taskForm.get('totalTime').updateValueAndValidity();
                    }
                }),
            this.taskForm.get('autoReduce').valueChanges
                .subscribe((autoReduce: boolean) => {
                    let spentTimeControl = this.taskForm.get('spentTime');
                    if (this.taskForm.get('needTimeManagement').value) {
                        if (autoReduce) {
                            spentTimeControl.disable();
                        } else {
                            spentTimeControl.enable();
                        }
                    } else {
                        spentTimeControl.enable();
                    }
                }),
            this.taskForm.get('status').valueChanges
                .subscribe((statusName: string) => {
                    if (TaskStatus.NEW == TaskStatus.getByName(statusName)) {
                        this.taskForm.get('spentTime').patchValue(0);
                    }
                    if (TaskStatus.NEW == TaskStatus.getByName(statusName)
                        || TaskStatus.PAUSE == TaskStatus.getByName(statusName)) {
                        this.taskForm.get('needTimeManagement').enable();
                        this.taskForm.get('autoReduce').enable();
                    } else {
                        this.taskForm.get('needTimeManagement').disable();
                        this.taskForm.get('autoReduce').disable();
                    }
                })
        )
    }

    private _filter(name: string): Array<TaskCategory> {
        const filterValue = name.toLowerCase();

        return this.viewCategories
            .filter((option: TaskCategory) => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

}
