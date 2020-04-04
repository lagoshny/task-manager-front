import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { User } from '../models/user.model';
import { AuthStorageUtils } from '../utils/auth-storage.utils';
import { UserStorageUtils } from '../utils/user-storage.utils';

@Injectable()
export class AuthService {

    /**
     * Get user's data from local storage.
     */
    public getUser(): User {
        return UserStorageUtils.getUser();
    }

    /**
     * Set user's data to local storage.
     */
    public setUser(user: User) {
        UserStorageUtils.saveUser(user);
    }

    /**
     * Check that current user is authenticated.
     */
    public isAuthenticated(): boolean {
        return !_.isEmpty(AuthStorageUtils.getCredentials());
    }

    /**
     * Save auth credentials to local storage.
     *
     * @param credentials auth credentials to save
     */
    public setCredentials(credentials: string): void {
        AuthStorageUtils.clearCredentials();
        if (_.isEmpty(credentials)) {
            throw new Error('Credentials cannot be empty!');
        }
        AuthStorageUtils.saveCredentials(credentials);
    }

    /**
     * Get auth credentials from local storage.
     */
    public getCredentials(): string {
        return AuthStorageUtils.getCredentials();
    }

    /**
     * Clear user's credentials.
     */
    public logOut(): void {
        AuthStorageUtils.clearCredentials();
        UserStorageUtils.clearUser();
    }

}
