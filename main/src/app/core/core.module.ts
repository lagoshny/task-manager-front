import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonPageComponent } from './components/common-page/common-page.component';
import { FontIconListDialogComponent } from './components/font-icon-list-dialog/font-icon-list-dialog.component';
import { ServerNotificationComponent } from './components/server-notification/server-notification.component';
import { SimpleDialogComponent } from './components/simple-dialog/simple-dialog.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AmountCharactersPipe } from './pipes/amount-characters.pipe';
import { AuthService } from './services/auth.service';
import { FontIconService } from './services/font-icon.service';


@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatSnackBarModule
    ],
    declarations: [
        CommonPageComponent,
        FontIconListDialogComponent,
        SimpleDialogComponent,
        ServerNotificationComponent,
        AmountCharactersPipe
    ],
    providers: [
        AuthService,
        FontIconService,
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
    ],
    exports: [
        CommonPageComponent,
        AmountCharactersPipe
    ],
    entryComponents: [
        FontIconListDialogComponent,
        SimpleDialogComponent,
        ServerNotificationComponent
    ]
})
export class CoreModule {
}
