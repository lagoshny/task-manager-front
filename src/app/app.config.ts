import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideNgxValidationMessages } from '@lagoshny/ngx-validation-messages';
import { provideNgxHateoasClient } from '@lagoshny/ngx-hateoas-client';
import { ValidationMessagesConfig } from './core/validation/validation-messages.config';
import { User } from './core/models/user.model';
import { TaskCategory } from './core/models/task-category.model';
import { Task } from './core/models/task.model';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BasicAuthInterceptor } from './core/interceptors/basic-auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

export class ServerApi {

  public static readonly BASE_API = 'http://localhost:8080/api/v1';

  public static readonly LOGIN = {
    path: `${ServerApi.BASE_API}/auth/user`
  };

  public static readonly TASKS = {
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

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    provideAnimations(),
    provideNgxValidationMessages({
      messages: ValidationMessagesConfig.getMessages(),
      validationMessagesStyle: {
        blockClassNames: 'error_block'
      }
    }),
    provideNgxHateoasClient(
      {
        http: {
          rootUrl: ServerApi.BASE_API
        },
        useTypes: {
          resources: [User, TaskCategory, Task]
        }
      }
    ),
  ]
};

