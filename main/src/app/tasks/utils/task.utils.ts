import * as moment from 'moment';
import { TaskStatus } from '../../core/models/constants/task-status.items';
import { Task } from '../../core/models/task.model';

export class TaskUtils {

    /**
     * Calculating how much time was spending to the task.
     * Depends on the task status and the task auto reduce flag.
     *
     * @param task which need calculate spent time
     */
    public static calculateSpentTime(task: Task): number {
        if (task.autoReduce && TaskStatus.isProgress(TaskStatus.getByCode(task.status))) {
            const leftTime = Math.ceil(moment.duration(moment(task.startedDate)
                .add(task.totalTime, 'minutes')
                .diff(moment()))
                .asMinutes());
            return leftTime > 0 ? task.totalTime - leftTime : task.totalTime;
        }

        return task.spentTime;
    }

}
