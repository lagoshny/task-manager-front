import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNgxValidationMessages } from '@lagoshny/ngx-validation-messages';
import { provideNgxHateoasClient } from '@lagoshny/ngx-hateoas-client';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { HeaderModule } from './header/header.module';
import { UsersModule } from './users/users.module';
import { ValidationMessagesConfig } from './core/validation/validation-messages.config';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { User } from './core/models/user.model';
import { TaskCategory } from './core/models/task-category.model';
import { Task } from './core/models/task.model';

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
    importProvidersFrom(
      LoggerModule.forRoot({
        level: NgxLoggerLevel.DEBUG
      }),
      HomeModule,
      LoginModule,
      HeaderModule,
      UsersModule
    ),
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

