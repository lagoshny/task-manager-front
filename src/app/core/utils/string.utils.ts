export class StringUtils {

    public static EMPTY = '';

    public static SPACE = ' ';

    public static ELLIPSIS = '...';

    /**
     * Select right word form by number.
     *
     * @param {number} num            the number for which need to identify right form
     * @param {string[]} setWordForms the set of possible word forms
     *
     * @returns {string} result string which contains number and word in right form
     */
    public static getFormWordByNumber(num: number, setWordForms: Array<string>): string {
        return num % 10 === 1 && num % 100 !== 11
            ? setWordForms[0]
            : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
                ? setWordForms[1]
                : setWordForms[2]);
    }

}
