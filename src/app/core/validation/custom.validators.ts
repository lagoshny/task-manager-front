import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export class CustomValidators {

  /**
   * Check that {@link FormGroup} with password controls have identical passwords.
   *
   * @param c as {@link FormGroup} with {@code password} and {@code confirmPassword} controls
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

  /**
   * Check password strength.
   * Password should contains: at least 8 characters and include numbers
   * with upper and lower case letters of the Latin alphabet.
   */
  public static passwordStrength(minLength = 8, maxLength = 25): ValidatorFn {
    return (c: AbstractControl) => {
      const passwordPattern = new RegExp(`^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{${ minLength },${ maxLength }}$`);
      if (!c || !c.value || passwordPattern.test(c.value)) {
        return undefined;
      }

      return {
        passwordStrength: {
          minLength,
          maxLength
        }
      };
    };
  }

  /**
   * Check that value contains only numbers.
   */
  public static number(c: AbstractControl): { [key: string]: boolean } {
    if (!c || !c.value || /^[0-9]+$/.test(c.value)) {
      return undefined;
    }

    return {
      number: true
    };
  }

  /**
   * Check that value contains only Latin with numbers symbols.
   */
  public static latinWithNumbers(c: AbstractControl): { [key: string]: boolean } {
    if (!c || !c.value || /^[a-zA-Z0-9]+$/.test(c.value)) {
      return undefined;
    }

    return {
      latinWithNumbers: true
    };
  }

  public static latinWithNumbersAnd(additionalSymbols: Array<string>): ValidatorFn {
    return (c: AbstractControl) => {
      if (!c || !c.value || new RegExp(`^[a-zA-Z0-9${ additionalSymbols }]+$`).test(c.value)) {
        return undefined;
      }

      return {
        latinWithNumbersAnd: {
          additionalSymbols
        }
      };
    };
  }

  /**
   * Check that date value less or equal current date.
   */
  public static notFeatureDate(c: AbstractControl): { [key: string]: boolean } {
    if (!c || !c.value || moment().isAfter(moment(c.value)) || moment().isSame(moment(c.value))) {
      return undefined;
    }

    return {
      notFeatureDate: true
    };
  }

}
