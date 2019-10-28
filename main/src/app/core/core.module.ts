import { NgModule } from '@angular/core';
import { CommonPageComponent } from './components/common-page/common-page.component';
import { AuthService } from './services/auth.service';


@NgModule({
    declarations: [
        CommonPageComponent
    ],
    providers: [
        AuthService
    ],
    exports: [
      CommonPageComponent
    ]
})
export class CoreModule {
}
