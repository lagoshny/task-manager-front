import * as moment from 'moment';
import { TaskStatus } from '../../core/models/constants/task-status.items';
import { Task } from '../../core/models/task.model';
import { TaskUtils } from './task.utils';

describe('TaskUtils', () => {

   it('if task autoReduce is FALSE then return task spentTime', () => {
      const taskToTest = new Task();
      taskToTest.spentTime = 10;
      taskToTest.totalTime = 20;
      taskToTest.autoReduce = false;

      const result = TaskUtils.calculateSpentTime(taskToTest);

      expect(result).toBe(taskToTest.spentTime);
   });

    it('if task status is NOT in_progress then return task spentTime', () => {
        const taskToTest = new Task();
        taskToTest.spentTime = 10;
        taskToTest.totalTime = 20;
        taskToTest.status = TaskStatus.NEW.code;

        const result = TaskUtils.calculateSpentTime(taskToTest);

        expect(result).toBe(taskToTest.spentTime);
    });

    it('if task autoReduce is TRUE and task status is NOT in_progress then return task spentTime', () => {
        const taskToTest = new Task();
        taskToTest.spentTime = 10;
        taskToTest.totalTime = 20;
        taskToTest.autoReduce = true;
        taskToTest.status = TaskStatus.NEW.code;

        const result = TaskUtils.calculateSpentTime(taskToTest);

        expect(result).toBe(taskToTest.spentTime);
    });

    it('if task autoReduce is FALSE and task status IS in_progress then return task spentTime', () => {
        const taskToTest = new Task();
        taskToTest.spentTime = 10;
        taskToTest.totalTime = 20;
        taskToTest.autoReduce = false;
        taskToTest.status = TaskStatus.IN_PROGRESS.code;

        const result = TaskUtils.calculateSpentTime(taskToTest);

        expect(result).toBe(taskToTest.spentTime);
    });

    it('should return calculated task spentTime depends on task startedDate', () => {
        const taskToTest = new Task();
        taskToTest.totalTime = 20;
        taskToTest.startedDate = moment().subtract('10', 'minutes').toDate();
        taskToTest.autoReduce = true;
        taskToTest.status = TaskStatus.IN_PROGRESS.code;

        const result = TaskUtils.calculateSpentTime(taskToTest);

        expect(result).toBe(10);
    });

    it('should return task totalTime when task spent time is MORE that task total time', () => {
        const taskToTest = new Task();
        taskToTest.totalTime = 8;
        taskToTest.startedDate = moment().subtract('10', 'minutes').toDate();
        taskToTest.autoReduce = true;
        taskToTest.status = TaskStatus.IN_PROGRESS.code;

        const result = TaskUtils.calculateSpentTime(taskToTest);

        expect(result).toBe(taskToTest.totalTime);
    });
});