import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNgxValidationMessages } from '@lagoshny/ngx-validation-messages';
import { NgxHateoasClientModule } from '@lagoshny/ngx-hateoas-client';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { HeaderModule } from './header/header.module';
import { UsersModule } from './users/users.module';
import { ValidationMessagesConfig } from './core/validation/validation-messages.config';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideNgxValidationMessages({
      messages: ValidationMessagesConfig.getMessages(),
      validationMessagesStyle: {
        blockClassNames: 'error_block'
      }
    }),
    importProvidersFrom(
      NgxHateoasClientModule,
      LoggerModule.forRoot({
        level: NgxLoggerLevel.DEBUG
      }),
      HomeModule,
      LoginModule,
      HeaderModule,
      UsersModule
    )
  ]
};

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
