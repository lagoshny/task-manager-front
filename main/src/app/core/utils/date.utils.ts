import * as _ from 'lodash';
import { StringUtils } from './string.utils';

export class DateUtils {

    /**
     * Get full string for minutes in right word form
     *
     * @param {number} minutes the number minutes
     *
     * @returns {string} string which contains number minutes and word in right form
     */
    public static getMinutesAsString(minutes: number): string {
        if (!_.isNumber(minutes) || _.isNaN(minutes)) {
            return StringUtils.EMPTY;
        }
        const hourFormsEn = ['minute', 'minutes', 'minutes'];

        return `${minutes} ${StringUtils.getFormWordByNumber(minutes, hourFormsEn)}`;
    }

}
