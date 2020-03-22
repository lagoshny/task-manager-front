import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { NgxValidationMessagesModule } from '@lagoshny/ngx-validation-messages';
import { CoreModule } from '../core/core.module';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { LoginGuard } from './guards/login.guard';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routing.module';
import { LoginService } from './services/login.service';
import { UserService } from './services/user.service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        CoreModule,
        LoginRoutingModule,
        NgxValidationMessagesModule,
        MatInputModule,
        MatMomentDateModule,
        MatDatepickerModule
    ],
    declarations: [
        LoginComponent,
        LoginFormComponent,
        RegistrationFormComponent
    ],
    providers: [
        LoginGuard,
        LoginService,
        UserService
    ],
    exports: [
        LoginComponent
    ]
})
export class LoginModule {
}
