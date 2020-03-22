import { AbstractControl } from '@angular/forms';

/**
 * Contains all custom form validators as static methods.
 */
export class CustomValidators {

    /**
     * Check that {@link FormGroup} with password controls have identical passwords.
     *
     * @param c {@link FormGroup} with {@code password} and {@code confirmPassword} controls
     */
    public static passwordMatcher(c: AbstractControl): { [key: string]: boolean } | undefined {
        const passwordControl = c.get('password');
        const passwordConfirmControl = c.get('confirmPassword');
        if (passwordControl.pristine || passwordConfirmControl.pristine) {
            return undefined;
        }
        if (passwordControl.value === passwordConfirmControl.value) {
            return undefined;
        }

        return {passwordMatch: true};
    }

}
