import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { dropDownAnimation } from '../../../core/animations/common.animation';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { CustomValidators } from '../../../core/validation/custom.validators';
import { UserService } from '../../services/user.service';

@Component({
    templateUrl: './user-from.component.html',
    styleUrls: ['./user-from.component.scss'],
    animations: [dropDownAnimation]
})
export class UserFromComponent implements OnInit {

    public userForm: FormGroup;

    constructor(public router: Router,
                private formBuilder: FormBuilder,
                private logger: NGXLogger,
                private authService: AuthService,
                private userService: UserService) {
    }

    public ngOnInit(): void {
        this.userForm = this.buildForm();
        this.userService.get(this.authService.getUser().id).subscribe((u: User) => {
            this.userForm.patchValue(u);
        });
    }

    public saveUser(): void {
        const updatedUser: User = {
            ...this.authService.getUser(),
            ...this.userForm.value
        };

        this.userService.patch(updatedUser).subscribe((u: User) => {
            this.authService.setUser(u);
            this.router.navigate(['home']).catch(reason => {
                this.logger.error(reason);
            });
        });
    }

    private buildForm(): FormGroup {
        return this.formBuilder.group({
            firstName: ['', [Validators.maxLength(100), CustomValidators.latinOrCyrillic]],
            middleName: ['', [Validators.maxLength(100), CustomValidators.latinOrCyrillic]],
            lastName: ['', [Validators.maxLength(100), CustomValidators.latinOrCyrillic]],
            birthday: ['', CustomValidators.notFeatureDate],
            city: ['', Validators.maxLength(50)],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]]
        });
    }

}
