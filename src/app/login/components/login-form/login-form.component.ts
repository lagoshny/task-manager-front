import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { NGXLogger } from 'ngx-logger';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { LoginService } from '../../services/login.service';
import { MatFormField, MatInput } from '@angular/material/input';
import { NgxValidationMessagesComponent } from '@lagoshny/ngx-validation-messages';
import { MatButton } from '@angular/material/button';

@Component({
  templateUrl: './login-form.component.html',
  styleUrls: ['../../login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    NgxValidationMessagesComponent,
    MatInput,
    MatButton,
  ]
})
export class LoginFormComponent {

  public loginForm: UntypedFormGroup;

  constructor(public router: Router,
              private formBuilder: UntypedFormBuilder,
              private loginService: LoginService,
              private authService: AuthService,
              // private logger: NGXLogger,
              ) {
    this.buildForm();
  }

  public login(): void {
    const user = this.loginForm.value as User;
    this.loginService.login(user)
      .subscribe((authUser: User) => {
          this.authService.setCredentials(btoa(user.username + ':' + user.password));
          this.authService.setUser(authUser);
          this.router.navigate(['home']);
            // .catch(reason => this.logger.error(reason));
        },
        (errorResponse: HttpErrorResponse) => {
          // this.logger.error(errorResponse);
        });
  }

  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

}
