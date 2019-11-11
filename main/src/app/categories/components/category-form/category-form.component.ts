import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { dropDownAnimation } from '../../../core/animations/common.animation';
import { FontIconListDialogComponent } from '../../../core/components/font-icon-list-dialog/font-icon-list-dialog.component';
import { TaskCategory } from '../../../core/models/task-category.model';
import { AuthService } from '../../../core/services/auth.service';
import { CategoryService } from '../../services/category.service';

@Component({
    selector: 'tm-category-form',
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.scss'],
    animations: [
        dropDownAnimation
    ]
})
export class CategoryFormComponent implements OnInit, OnDestroy {

    public categoryForm: FormGroup;

    public formHeader = 'New category';

    public buttonName = 'Create';

    private subs: Array<Subscription> = [];

    private categoryToEdit: TaskCategory;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private logger: NGXLogger,
                private dialog: MatDialog,
                private authService: AuthService,
                private categoryService: CategoryService) {
    }

    public ngOnInit(): void {
        this.categoryForm = this.buildForm();
        const categoryID = this.activatedRoute.snapshot.paramMap.get('categoryID');
        if (categoryID) {
            this.formHeader = 'Edit category';
            this.buttonName = 'Save';
            this.subs.push(
                this.categoryService.get(categoryID).subscribe((taskCategory: TaskCategory) => {
                    this.categoryToEdit = taskCategory;
                    this.categoryForm.patchValue({
                        ...taskCategory
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
        const categoryFromForm = this.categoryForm.getRawValue() as TaskCategory;
        if (this.categoryToEdit) {
            const category = _.merge(this.categoryToEdit, categoryFromForm);
            this.subs.push(
                this.categoryService.patch(category).subscribe((/* updatedCategory: TaskCategory */) => {
                    this.router.navigate(['home'])
                        .catch(reason => this.logger.error(reason));
                })
            );
        } else {
            categoryFromForm.user = this.authService.getUser();
            this.subs.push(
                this.categoryService.create(categoryFromForm)
                    .subscribe((/*category: TaskCategory*/) => {
                        this.router.navigate(['home'])
                            .catch(reason => this.logger.error(reason));
                    })
            )
        }
    }

    public onShowIconList(): void {
        this.dialog.open(FontIconListDialogComponent).afterClosed().subscribe((selectedIcon: string) => {
            if (selectedIcon) {
                this.categoryForm.patchValue({
                    icon: selectedIcon
                })
            }
        });
    }

    private buildForm(): FormGroup {
        return this.formBuilder.group({
            name: '',
            prefix: '',
            description: '',
            icon: 'fa-certificate'
        })
    }

}
