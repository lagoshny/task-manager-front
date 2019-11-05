import { NgModule } from '@angular/core';
import { CommonPageComponent } from './components/common-page/common-page.component';
import { AmountCharactersPipe } from './pipes/amount-characters.pipe';
import { AuthService } from './services/auth.service';


@NgModule({
    declarations: [
        CommonPageComponent,
        AmountCharactersPipe
    ],
    providers: [
        AuthService
    ],
    exports: [
        CommonPageComponent,
        AmountCharactersPipe
    ]
})
export class CoreModule {
}
