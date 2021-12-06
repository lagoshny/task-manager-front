import { HateoasProjection, ProjectionRel, ProjectionRelType, Resource } from '@lagoshny/ngx-hateoas-client';
import { Task } from './task.model';
import { User } from './user.model';
import { TaskCategory } from './task-category.model';

@HateoasProjection(Task, 'taskProjection')
export class TaskProjection extends Resource {

  public id: string;
  public number: number;
  public name: string;
  public description: string;
  @ProjectionRel(User)
  public author: ProjectionRelType<User>;
  @ProjectionRel(TaskCategory)
  public category: ProjectionRelType<TaskCategory>;
  public priority: string;
  public status: string;
  public needTimeManagement: boolean;
  public totalTime: number;
  public spentTime: number;
  public autoReduce: boolean;

}
