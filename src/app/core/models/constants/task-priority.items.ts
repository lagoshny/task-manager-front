import { CommonSelectItem } from './common-select-item.constant';

export class TaskPriority extends CommonSelectItem<TaskPriority> {

  public static HIGH = new TaskPriority('High', 'HIGH', '', 'red', 'fa-exclamation-circle');
  public static MIDDLE = new TaskPriority('Middle', 'MIDDLE', '', 'orange', 'fa-bolt');
  public static LOWER = new TaskPriority('Low', 'LOW', '', 'green', 'fa-level-down');

  public static getAll(): Array<TaskPriority> {
    return TaskPriority.getAllByType<TaskPriority>(TaskPriority);
  }

  public static getByCode(code: any): TaskPriority {
    return TaskPriority.getTypeByCode(TaskPriority, code);
  }

  public static getByName(name: any): TaskPriority {
    return TaskPriority.getTypeByName(TaskPriority, name);
  }

}

