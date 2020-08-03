/**
 * Holds all verification messages for form validators.
 */
export class ValidationMessagesConfig {
  public static getMessages(): any {
    return {
      defError: 'Invalid value',
      required: 'This field is required',
      email: 'Invalid email value',
      passwordMatch: 'Passwords do not match',
      passwordStrength: 'Password must contain at least #[minLength] characters and include numbers, ' +
        'upper and lower case letters of the Latin alphabet',
      cyrillic: 'Only cyrillic characters are allowed',
      latin: 'Only latin characters are allowed',
      latinOrCyrillic: 'Only latin or cyrillic characters are allowed',
      latinWithNumbers: 'Only latin characters and numbers are allowed',
      latinWithNumbersAnd: 'Only latin characters, numbers and symbols: [#[additionalSymbols]] are allowed',
      symbolsWithNumbers: 'The value should consist only of latin / cyrillic characters and numbers',
      notFeatureDate: 'The value must not be greater than the current date',
      number: 'Only numbers allowed'
    };
  }
}
