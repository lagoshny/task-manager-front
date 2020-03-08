import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TaskCategory } from '../models/task-category.model';

/**
 * Service allows manage dependencies between tasks and categories.
 */
@Injectable()
export class TaskCategoryService {

    public categoriesByFilter = new Subject<Array<TaskCategory>>();

    public tasks = new Subject<void>();

    public categories = new Subject<void>();

    /**
     * Generates a filtering event for the selected category list.
     *
     * @param categories list of categories for filtering
     */
    public updateCategoriesByFilter(categories: Array<TaskCategory>): void {
        this.categoriesByFilter.next(categories);
    }

    /**
     * Generates an event that needs to update the task list.
     */
    public refreshTasks(): void {
        this.tasks.next();
    }

    /**
     * Generates an event that needs to update the categories list.
     */
    public refreshCategories(): void {
        this.categories.next();
    }

}
