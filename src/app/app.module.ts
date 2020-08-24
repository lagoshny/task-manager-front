import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxHalClientModule } from '@lagoshny/ngx-hal-client';
import { NgxValidationMessagesModule } from '@lagoshny/ngx-validation-messages';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AppComponent } from './app.component';
import { ExternalConfigurationService } from './app.config';
import { AppRoutingModule } from './app.routing.module';
import { DateUtils } from './core/utils/date.utils';
import { ValidationMessagesConfig } from './core/validation/validation-messages.config';
import { HeaderModule } from './header/header.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxHalClientModule.forRoot(),
    NgxValidationMessagesModule.forRoot({
      messages: ValidationMessagesConfig.getMessages(),
      validationMessagesStyle: {
        blockClassNames: 'error_block'
      }
    }),
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG
    }),
    HomeModule,
    AppRoutingModule,
    LoginModule,
    HeaderModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    {provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService},
    {
      provide: MAT_DATE_FORMATS,
      useValue: DateUtils.getMaterialDateFormat()
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
