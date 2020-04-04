import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExternalConfiguration, ExternalConfigurationHandlerInterface } from '@lagoshny/ngx-hal-client';

@Injectable()
export class ExternalConfigurationService implements ExternalConfigurationHandlerInterface {

    constructor(private http: HttpClient) {
    }

    public deserialize(): any {
    }

    public serialize(): any {
    }

    public getProxyUri(): string {
        return '';
    }

    public getRootUri(): string {
        return ServerApi.BASE_API;
    }

    public getHttp(): HttpClient {
        return this.http;
    }

    public getExternalConfiguration(): ExternalConfiguration {
        return undefined;
    }

    public setExternalConfiguration(externalConfiguration: ExternalConfiguration): any {
    }

}

export class ServerApi {

    public static readonly BASE_API = 'http://localhost:8080/api/v1';

    public static readonly LOGIN = {
        path: `${ServerApi.BASE_API}/auth/user`
    };

    public static readonly LOGOUT = {
        path: `${ServerApi.BASE_API}/logout`
    };

    public static readonly USERS = {
        resource: 'users'
    };

    public static readonly TASKS = {
        resource: 'tasks',
        allByAuthor: {
            query: 'allByAuthor',
            authorParam: 'user'
        },
        byNumberAndCategory: {
            query: 'byNumberAndCategory',
            authorParam: 'user',
            numberParam: 'number',
            categoryParam: 'categoryPrefix'
        },
        allByAuthorAndCategories: {
            query: 'allByAuthorAndCategories',
            authorParam: 'userId',
            categoriesIds: 'categoriesIds'
        },
        relations: {
            taskCategory: 'category'
        },
        projections: {
            taskProjection: {
                key: 'projection',
                value: 'taskProjection'
            }
        }
    };

    public static readonly TASK_CATEGORIES = {
        resource: 'task-categories',
        byPrefix: {
            query: 'byPrefix',
            prefixParam: 'prefix',
            userParam: 'user'
        },
        allByUser: {
            query: 'allByUser',
            userParam: 'user'
        }
    };

}
