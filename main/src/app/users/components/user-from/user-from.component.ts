import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { dropDownAnimation } from '../../../core/animations/common.animation';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
    templateUrl: './user-from.component.html',
    styleUrls: ['./user-from.component.scss'],
    animations: [dropDownAnimation]
})
export class UserFromComponent {

    public userForm: FormGroup;

    constructor(public router: Router,
                private formBuilder: FormBuilder,
                private logger: NGXLogger,
                private authService: AuthService,
                private userService: UserService) {
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
            this.authService.setAuthUser(u);
            this.router.navigate(['home']).catch(reason => {
                this.logger.error(reason);
            });
        });
    }

    private buildForm(): FormGroup {
        return this.formBuilder.group({
            firstName: [''],
            middleName: [''],
            lastName: [''],
            birthday: [''],
            city: [''],
            email: ['']
        });
    }

}
