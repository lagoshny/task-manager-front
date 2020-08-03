import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { NgxValidationMessagesModule } from '@lagoshny/ngx-validation-messages';
import { CoreModule } from '../core/core.module';
import { UserFromComponent } from './components/user-from/user-from.component';
import { UserService } from './services/user.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    NgxValidationMessagesModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule
  ],
  declarations: [
    UserFromComponent
  ],
  providers: [
    UserService
  ],
  exports: [
    UserFromComponent
  ]
})
export class UsersModule {
}
