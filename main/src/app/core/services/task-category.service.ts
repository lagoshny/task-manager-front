import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Service allows manage dependencies between tasks and categories.
 */
@Injectable()
export class TaskCategoryService {

    public tasks = new Subject<void>();

    public categories = new Subject<void>();

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
