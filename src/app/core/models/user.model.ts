import { Resource } from '@lagoshny/ngx-hal-client';
import { Task } from './task.model';

export class User extends Resource {

  /**
   * User's id.
   */
  public id: number;

  /**
   * {@code true} if user enabled, {@code false} otherwise.
   */
  public enabled: boolean;

  /**
   * Username / user login.
   */
  public username: string;

  /**
   * User's password.
   * This property doesn't fill from server for safety.
   */
  public password: string;

  /**
   * User's task list.
   */
  public tasks: Array<Task>;

  /**
   * User's email.
   */
  public email: string;

  /**
   * User's first name.
   */
  public firstName: string;

  /**
   * User's middle name.
   */
  public middleName: string;

  /**
   * User's last name.
   */
  public lastName: string;

  /**
   * User's city.
   */
  public city: string;

  /**
   * User's birthday.
   */
  public birthday: Date;

}
