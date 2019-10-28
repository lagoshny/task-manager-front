
export class TaskPriority {

    public static HIGH = new TaskPriority('High', 'HIGH', '', 'red', 'fa-exclamation-circle');
    public static MIDDLE = new TaskPriority('Middle', 'MIDDLE', '', 'orange', 'fa-bolt');
    public static LOWER = new TaskPriority('Low', 'LOW', '', 'green', 'fa-level-down');

    constructor(public name?: string, public code?: string,
                public className?: string, public color?: string, public icon?: string) {
    }

}

