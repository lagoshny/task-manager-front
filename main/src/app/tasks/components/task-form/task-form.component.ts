import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isString } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
    changeHeightAnimation,
    dropDownAnimation,
    showSectionAnimation
} from '../../../core/animations/common.animation';
import { TaskPriority } from '../../../core/models/constants/task-priority.items';
import { TaskCategory } from '../../../core/models/task-category.model';
import { AuthService } from '../../../core/services/auth.service';
import { TaskCategoryService } from '../../services/task-category.service';

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

    public viewCategories: Array<TaskCategory> = [];

    public filteredCategories: Observable<Array<TaskCategory>>;

    public taskPriorities: Array<TaskPriority> = TaskPriority.getAll();

    public showTimeSection = false;

    private subs: Array<Subscription> = [];

    constructor(public router: Router,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private authService: AuthService,
                private taskCategoryService: TaskCategoryService) {
    }

    public ngOnInit(): void {
        this.buildForm();
        this.loadUserCategories();
        this.watchValueChanges();
        const taskID = this.activatedRoute.snapshot.paramMap.get('taskID');
        if (taskID) {
            this.formHeader = 'Edit task';
        }
    }

    public ngOnDestroy(): void {
        this.subs.forEach((sub: Subscription) => {
            sub.unsubscribe();
        })
    }

    public sendForm(): void {
        console.log(this.taskForm.getRawValue());
    }

    private buildForm(): void {
        this.taskForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            category: ['', [Validators.required]],
            description: [''],
            priority: ['', [Validators.required]],
            needTimeManagement: false,
            totalTime: '',
            spentTime: '',
            autoReduce: ''
        });
    }

    private loadUserCategories(): void {
        this.subs.push(
            this.taskCategoryService.getAllByUserId(this.authService.getUser())
                .subscribe((categories: Array<TaskCategory>) => {
                    this.viewCategories = categories;
                    this.filteredCategories = this.taskForm.get('category').valueChanges
                        .pipe(
                            startWith(''),
                            map((value: TaskCategory | string) => isString(value) ? value : value.name),
                            map((name: string) => name ? this._filter(name) : this.viewCategories.slice())
                        );
            })
        );
    }

    public displayFn(category?: TaskCategory): string | undefined {
        return category ? category.name : undefined;
    }

    private _filter(name: string): Array<TaskCategory> {
        const filterValue = name.toLowerCase();

        return this.viewCategories
            .filter((option: TaskCategory) => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    private watchValueChanges(): void {
        this.taskForm.get('needTimeManagement').valueChanges
            .subscribe((value: boolean) => {
                this.showTimeSection = value;
                if (!this.showTimeSection) {
                    this.taskForm.patchValue({
                        totalTime: '',
                        autoReduce: false
                    });
                }
            })
    }
}
