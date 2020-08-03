/**
 * Local storage to hold current authenticated user.
 */
import { User } from '../models/user.model';

export class UserStorageUtils {

  private static USER_STORAGE_KEY = 'auth_user';

  public static saveUser(user: User): void {
    localStorage.setItem(UserStorageUtils.USER_STORAGE_KEY, JSON.stringify(user));
  }

  public static getUser(): User {
    return Object.assign(new User(), JSON.parse(localStorage.getItem(UserStorageUtils.USER_STORAGE_KEY)));
  }

  public static clearUser(): void {
    localStorage.removeItem(UserStorageUtils.USER_STORAGE_KEY);
  }

}
