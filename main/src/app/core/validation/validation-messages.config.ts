/**
 * Holds all verification messages for form validators.
 */
export class ValidationMessagesConfig {
    public static getMessages(): any {
        return {
            defError: 'Вы ввели неверное значение',
            required: 'Данное поле обязательно для запонения'
        };
    }
}
