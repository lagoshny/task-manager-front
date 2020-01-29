import { Resource } from '@lagoshny/ngx-hal-client';
import { User } from './user.model';

export class TaskCategory extends Resource {

    /**
     * Category id.
     */
    public id: number;

    /**
     * Category owner.
     */
    public user: User;

    /**
     * Name of the category.
     */
    public name: string;

    /**
     * Category description.
     */
    public description: string;

    /**
     * Prefix which forms for task number.
     */
    public prefix: string;

    /**
     * Category icon.
     */
    public icon: string;

    /**
     * Category color.
     */
    public color: string;

    public constructor() {
        super();
    }

}
