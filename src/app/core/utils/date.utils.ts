import * as _ from 'lodash';
import { StringUtils } from './string.utils';

export class DateUtils {

  /**
   * Custom date format for material datepicker component.
   */
  public static getMaterialDateFormat(): object {
    return {
      parse: {
        dateInput: 'DD.MM.YYYY',
      },
      display: {
        dateInput: 'DD.MM.YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      }
    };
  }

  /**
   * Get full string for minutes in right word form
   *
   * @param minutes minutes the number minutes
   *
   * @returns string which contains number minutes and word in right form
   */
  public static getMinutesAsString(minutes: number): string {
    if (!_.isNumber(minutes) || _.isNaN(minutes)) {
      return StringUtils.EMPTY;
    }
    const hourFormsEn = ['minute', 'minutes', 'minutes'];

    return `${ minutes } ${ StringUtils.getFormWordByNumber(minutes, hourFormsEn) }`;
  }

}
