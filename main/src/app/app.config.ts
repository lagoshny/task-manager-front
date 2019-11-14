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

    public static readonly TASKS = {
        resource: 'tasks',
        allByAuthor: {
            query: 'allByAuthor',
            authorParam: 'userId'
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
            userIdParam: 'userId'
        },
        allByUserId: {
            query: 'allByUserId',
            userIdParam: 'userId'
        }
    };

}
