/**
 * Local storage to hold user's credentials.
 */
export class AuthStorageUtils {

  private static CREDENTIALS_STORAGE_KEY = 'user_credentials';

  public static saveCredentials(credentials: string): void {
    localStorage.setItem(AuthStorageUtils.CREDENTIALS_STORAGE_KEY, credentials);
  }

  public static getCredentials(): string {
    return localStorage.getItem(AuthStorageUtils.CREDENTIALS_STORAGE_KEY);
  }

  public static clearCredentials(): void {
    localStorage.removeItem(AuthStorageUtils.CREDENTIALS_STORAGE_KEY);
  }

}
