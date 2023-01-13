import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { User } from '../../../core/models/user.model';
import { CustomValidators } from '../../../core/validation/custom.validators';
import { UserService } from '../../../users/services/user.service';

@Component({
  templateUrl: './registration-form.component.html',
  styleUrls: ['../../login.component.scss']
})
export class RegistrationFormComponent {

  public registrationForm: UntypedFormGroup;

  constructor(public router: Router,
              private formBuilder: UntypedFormBuilder,
              private userService: UserService,
              private logger: NGXLogger) {
    this.buildForm();
  }

  public sendForm(): void {
    const user = this.registrationForm.value as User;
    user.password = this.registrationForm.get('passwordGroup.password').value;

    this.userService.createResource({body: user})
      .subscribe((/* u: User */) => {
          this.router.navigate(['login'])
            .catch(reason => this.logger.error(reason));
        },
        error => {
          this.logger.error(error);
        });
  }

  private buildForm(): void {
    this.registrationForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(100), CustomValidators.latinWithNumbers]],
      passwordGroup: this.formBuilder.group({
        password: ['', [Validators.required, Validators.maxLength(100), CustomValidators.passwordStrength(8)]],
        confirmPassword: ['', [Validators.required, Validators.maxLength(100), CustomValidators.passwordStrength(8)]]
      }, {validator: CustomValidators.passwordMatcher}),
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]]
    });
  }

}
