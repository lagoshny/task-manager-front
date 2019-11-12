import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonPageComponent } from './components/common-page/common-page.component';
import { FontIconListDialogComponent } from './components/font-icon-list-dialog/font-icon-list-dialog.component';
import { SimpleDialogComponent } from './components/simple-dialog/simple-dialog.component';
import { AmountCharactersPipe } from './pipes/amount-characters.pipe';
import { AuthService } from './services/auth.service';
import { FontIconService } from './services/font-icon.service';


@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule
    ],
    declarations: [
        CommonPageComponent,
        FontIconListDialogComponent,
        SimpleDialogComponent,
        AmountCharactersPipe
    ],
    providers: [
        AuthService,
        FontIconService
    ],
    exports: [
        CommonPageComponent,
        AmountCharactersPipe
    ],
    entryComponents: [
        FontIconListDialogComponent,
        SimpleDialogComponent
    ]
})
export class CoreModule {
}
