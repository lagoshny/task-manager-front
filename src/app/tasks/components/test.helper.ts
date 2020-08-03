import { TaskPriority } from '../../core/models/constants/task-priority.items';
import { TaskStatus } from '../../core/models/constants/task-status.items';
import { TaskCategory } from '../../core/models/task-category.model';
import { Task } from '../../core/models/task.model';
import { User } from '../../core/models/user.model';

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
  task.status = TaskStatus.NEW.name;
  return task;
}
