import { TaskPriority } from '../../core/models/constants/task-priority.items';
import { TaskStatus } from '../../core/models/constants/task-status.items';
import { TaskCategory } from '../../core/models/task-category.model';
import { Task } from '../../core/models/task.model';
import { User } from '../../core/models/user.model';
import { TaskProjection } from '../../core/models/task.projection';

export function getTestTask(): Task {
  const task = new Task();
  task.totalTime = 10;
  task.startedDate = new Date();
  const taskCategory = new TaskCategory();
  taskCategory.prefix = 'test';
  taskCategory.name = 'Test';
  task.category = taskCategory;
  task.author = new User();
  task.priority = TaskPriority.MIDDLE.code;
  task.status = TaskStatus.NEW.code;
  return task;
}

export function getTestTaskProjection(): TaskProjection {
  const taskProjection = new TaskProjection();
  taskProjection.totalTime = 10;
  taskProjection.startedDate = new Date();
  const taskCategory = new TaskCategory();
  taskCategory.prefix = 'test';
  taskCategory.name = 'Test';
  taskProjection.category = taskCategory;
  taskProjection.author = new User();
  taskProjection.priority = TaskPriority.MIDDLE.name;
  taskProjection.status = TaskStatus.NEW.name;
  return taskProjection;
}
