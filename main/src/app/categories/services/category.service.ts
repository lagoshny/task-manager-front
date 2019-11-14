import { Injectable, Injector } from '@angular/core';
import { RestService } from '@lagoshny/ngx-hal-client';
import { Observable } from 'rxjs';
import { ServerApi } from '../../app.config';
import { TaskCategory } from '../../core/models/task-category.model';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';

@Injectable()
export class CategoryService extends RestService<TaskCategory> {

    constructor(private authService: AuthService,
                injector: Injector) {
        super(TaskCategory, ServerApi.TASK_CATEGORIES.resource, injector);
    }

    /**
     * Get all categories to specified user.
     *
     * @param user for whom need to get categories
     */
    public getAllByUser(user: User): Observable<Array<TaskCategory>> {
        return this.search(ServerApi.TASK_CATEGORIES.allByUserId.query, {
            params: [
                {
                    key: ServerApi.TASK_CATEGORIES.allByUserId.userIdParam,
                    value: user.id
                }
            ]
        });
    }

    /**
     * Get user's category by category prefix.
     *
     * @param prefix category to find
     */
    public getByPrefix(prefix: string): Observable<TaskCategory> {
        const user = this.authService.getUser();
        return this.searchSingle(ServerApi.TASK_CATEGORIES.byPrefix.query, {
            params: [
                {
                    key: ServerApi.TASK_CATEGORIES.byPrefix.prefixParam,
                    value: prefix
                },
                {
                    key: ServerApi.TASK_CATEGORIES.byPrefix.userParam,
                    value: user
                }
            ]
        });
    }

}
