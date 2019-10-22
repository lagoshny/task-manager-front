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
        const hourForms = ['минута', 'минуты', 'минут'];

        return `${minutes} ${StringUtils.getFormWordByNumber(minutes, hourForms)}`;
    }

}
