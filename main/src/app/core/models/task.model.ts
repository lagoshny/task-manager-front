import { Resource } from '@lagoshny/ngx-hal-client';
import { TaskCategory } from './task-category.model';
import { User } from './user.model';

export class Task extends Resource {

    /**
     * Id of the task
     */
    public id: string;

    /**
     * Number for task.
     */
    public number: number;

    /**
     * Name of the task
     */
    public name: string;

    /**
     * Description of the task
     */
    public description: string;

    /**
     * Owner task
     */
    public author: User;

    /**
     * Category to which the task belongs
     */
    public category: TaskCategory;

    /**
     * Creation date of the task
     */
    public creationDate: Date;

    /**
     * Date when task was started
     */
    public startedDate: Date;

    /**
     * If need time management then true, otherwise false
     */
    public needTimeManagement: boolean;

    /**
     * Information about the full time for resolve task
     */
    public totalTime: number;

    /**
     * TimeLeft for resolving task
     */
    public leftTime: number;

    /**
     * Priority of the task {@link TaskPriority}
     */
    public priority: string;

    /**
     * Status of the task {@link TaskStatus}
     */
    public status: string;

    /**
     * If auto reduce time then true, false otherwise
     */
    public autoReduce: boolean;

    /**
     * Number of the time which spent to solve the task.
     */
    public spentTime: number;

    public constructor() {
        super();
    }

}
