/**
 * Holds all verification messages for form validators.
 */
export class ValidationMessagesConfig {
    public static getMessages(): any {
        return {
            defError: 'Invalid value',
            required: 'This field is required'
        };
    }
}
