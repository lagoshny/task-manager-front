import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { dropDownAnimation } from '../../../core/animations/common.animation';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { CustomValidators } from '../../../core/validation/custom.validators';
import { UserService } from '../../services/user.service';
import { NgxValidationMessagesComponent } from '@lagoshny/ngx-validation-messages';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { CommonPageComponent } from '../../../core/components/common-page/common-page.component';
import { MatButton } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  templateUrl: './user-from.component.html',
  animations: [dropDownAnimation],
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormField,
    ReactiveFormsModule,
    NgxValidationMessagesComponent,
    MatDatepickerInput,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatLabel,
    MatDatepickerToggle,
    MatDatepicker,
    MatInput,
    MatButton,
    CommonPageComponent,
  ],
})
export class UserFromComponent implements OnInit {

  public userForm: UntypedFormGroup;

  constructor(public router: Router,
              private formBuilder: UntypedFormBuilder,
              private authService: AuthService,
              private userService: UserService) {
  }

  public ngOnInit(): void {
    this.userForm = this.buildForm();
    this.userService.getResource(this.authService.getUser().id).subscribe((u: User) => {
      this.userForm.patchValue(u);
    });
  }

  public saveUser(): void {
    const updatedUser: User = {
      ...this.authService.getUser(),
      ...this.userForm.value
    };

    this.userService.patchResource(updatedUser).subscribe((u: User) => {
      this.authService.setUser(u);
      this.router.navigate(['home']);
      // .catch(reason => {this.logger.error(reason);});
    });
  }

  private buildForm(): UntypedFormGroup {
    return this.formBuilder.group({
      firstName: ['', [Validators.maxLength(100)]],
      middleName: ['', [Validators.maxLength(100)]],
      lastName: ['', [Validators.maxLength(100)]],
      birthday: ['', CustomValidators.notFeatureDate],
      city: ['', Validators.maxLength(50)],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]]
    });
  }

}
