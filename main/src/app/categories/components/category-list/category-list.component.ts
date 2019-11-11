import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { TaskCategory } from '../../../core/models/task-category.model';
import { AuthService } from '../../../core/services/auth.service';
import { CategoryService } from '../../services/category.service';

@Component({
    selector: 'tm-categories',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, OnDestroy {

    public categories: Array<TaskCategory> = [];

    public minimizeCategories = false;

    private subs: Array<Subscription> = [];

    constructor(private router: Router,
                private logger: NGXLogger,
                private authService: AuthService,
                private categoryService: CategoryService) {
    }

    public ngOnInit(): void {
        this.loadCategoriesByUser();
    }

    public onMinimizeCategories(): void {
        this.minimizeCategories = !this.minimizeCategories;
    }

    public ngOnDestroy(): void {
        this.subs.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
    }

    private loadCategoriesByUser(): void {
        this.subs.push(
            this.categoryService.getAllByUser(this.authService.getUser())
                .subscribe((taskCategories: Array<TaskCategory>) => {
                    this.categories = taskCategories;
                })
        );
    }

    public onAddCategory(): void {
        this.router.navigate(['categories/new'])
            .catch(reason => this.logger.error(reason));
    }

    public onCategoryEdit(category: TaskCategory): void {
        this.router.navigate(['categories/edit', category.id])
            .catch(reason => this.logger.error(reason));
    }

}
