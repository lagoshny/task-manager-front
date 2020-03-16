import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { NgxValidationMessagesModule } from '@lagoshny/ngx-validation-messages';
import { CoreModule } from '../core/core.module';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginGuard } from './guards/login.guard';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routing.module';
import { LoginService } from './services/login.service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        CoreModule,
        LoginRoutingModule,
        NgxValidationMessagesModule,
        MatInputModule
    ],
    declarations: [
        LoginComponent,
        LoginFormComponent
    ],
    providers: [
        LoginGuard,
        LoginService
    ],
    exports: [
        LoginComponent
    ]
})
export class LoginModule {
}
