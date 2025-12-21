import { AmountCharactersPipe } from './amount-characters.pipe';

describe('AmountCharactersPipe', () => {
  let pipe: AmountCharactersPipe;
  beforeEach(() => {
    pipe = new AmountCharactersPipe();
  });
  it('should return origin string when length EQ max characters', () => {
    const exampleString = 'Test string';
    const result = pipe.transform(exampleString, 11);
    expect(result).toBe(exampleString);
  });

  it('should return origin string when length LESS THEN max characters', () => {
    const exampleString = 'Test string';
    const result = pipe.transform(exampleString, 15);
    expect(result).toBe(exampleString);
  });

  it('should return ellipsis string when length GREAT THEN max characters', () => {
    const result = pipe.transform('Test string', 5);
    expect(result).toBe('Te...');
  });

  it('should return origin string when it is UNDEFINED', () => {
    const result = pipe.transform(undefined, 5);
    expect(result).toBe(undefined);
  });

  it('should return origin string when it is NULL', () => {
    const result = pipe.transform(null, 5);
    expect(result).toBe(null);
  });

  it('should return origin string when it is EMPTY', () => {
    const result = pipe.transform('', 5);
    expect(result).toBe('');
  });

  it('should return origin string when max characters is ZERO', () => {
    const exampleString = 'Test string';
    const result = pipe.transform(exampleString, 0);
    expect(result).toBe(exampleString);
  });

  it('should return origin string when max characters is UNDEFINED', () => {
    const exampleString = 'Test string';
    const result = pipe.transform(exampleString, undefined);
    expect(result).toBe(exampleString);
  });

  it('should return origin string when max characters is NULL', () => {
    const exampleString = 'Test string';
    const result = pipe.transform(exampleString, null);
    expect(result).toBe(exampleString);
  });

  it('should return origin string when max characters is NaN', () => {
    const exampleString = 'Test string';
    const result = pipe.transform(exampleString, NaN);
    expect(result).toBe(exampleString);
  });

});
