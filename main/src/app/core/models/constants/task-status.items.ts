export class TaskStatus {

    public static NEW = new TaskStatus('Новая', 'NEW', 'new', '#28CAD4');
    public static NOT_COMPLETED = new TaskStatus('Не выполнена', 'NOT_COMPLETED',
        'not_completed', '#9F0909');
    public static COMPLETED = new TaskStatus('Выполнена', 'COMPLETED',
        'completed', '#329D03');
    public static PAUSE = new TaskStatus('Приостановлена', 'PAUSE',
        'pause', '#28CAD4');
    public static IN_PROGRESS = new TaskStatus('В процессе', 'IN_PROGRESS',
        'in_progress', '#D65F2B');

    constructor(public name?: string, public code?: string,
                public className?: string, public color?: string, public icon?: string) {
    }

}
