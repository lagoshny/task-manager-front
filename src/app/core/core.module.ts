import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonPageComponent } from './components/common-page/common-page.component';
import { FontIconListDialogComponent } from './components/font-icon-list-dialog/font-icon-list-dialog.component';
import { NotificationLayoutComponent } from './components/notification/notification-layout.component';
import { SimpleDialogComponent } from './components/simple-dialog/simple-dialog.component';
import { AuthGuard } from './guards/auth.guard';
import { BasicAuthInterceptor } from './interceptors/basic-auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AmountCharactersPipe } from './pipes/amount-characters.pipe';
import { AuthService } from './services/auth.service';
import { FontIconService } from './services/font-icon.service';
import { NotificationService } from './services/notification.service';
import { TaskCategoryService } from './services/task-category.service';

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
        NotificationLayoutComponent,
        AmountCharactersPipe
    ],
    providers: [
        AuthGuard,
        AuthService,
        FontIconService,
        NotificationService,
        TaskCategoryService,
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true }
    ],
    exports: [
        CommonPageComponent,
        AmountCharactersPipe
    ]
})
export class CoreModule {
}
