export class TaskStatus {

    public static NEW = new TaskStatus('New', 'NEW', 'new', '#28CAD4');
    public static NOT_COMPLETED = new TaskStatus('Not completed', 'NOT_COMPLETED',
        'not_completed', '#9F0909');
    public static COMPLETED = new TaskStatus('Completed', 'COMPLETED',
        'completed', '#329D03');
    public static PAUSE = new TaskStatus('Paused', 'PAUSE',
        'pause', '#28CAD4');
    public static IN_PROGRESS = new TaskStatus('In progress', 'IN_PROGRESS',
        'in_progress', '#D65F2B');

    constructor(public name?: string, public code?: string,
                public className?: string, public color?: string, public icon?: string) {
    }

    public static getByName<T>(name: any): TaskStatus {
        for (const key in TaskStatus) {
            if (this[key] instanceof TaskStatus) {
                if (this[key].name === name) {
                    return this[key];
                }
            }
        }
    }

    public static getByCode<T>(code: any): TaskStatus {
        for (const key in TaskStatus) {
            if (this[key] instanceof TaskStatus) {
                if (this[key].code === code) {
                    return this[key];
                }
            }
        }
    }

    // TODO: подумать что сделать с этими методами
    public static isProgress(status: TaskStatus | string): boolean {
        if (status instanceof TaskStatus) {
            return status.name === TaskStatus.IN_PROGRESS.name;
        } else {
            return status === TaskStatus.IN_PROGRESS.name;
        }
    }

    public static isCompleted(status: TaskStatus | string): boolean {
        if (status instanceof TaskStatus) {
            return status.name === TaskStatus.COMPLETED.name;
        } else {
            return status === TaskStatus.COMPLETED.name;
        }
    }

    public static isNew(status: TaskStatus | string): boolean {
        if (status instanceof TaskStatus) {
            return status.name === TaskStatus.NEW.name;
        } else {
            return status === TaskStatus.NEW.name;
        }
    }

}
