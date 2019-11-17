import { AmountCharactersPipe } from './amount-characters.pipe';

describe('AmountCharactersPipe', () => {
    let pipe: AmountCharactersPipe;
    beforeEach(() => {
        pipe = new AmountCharactersPipe()
    });
    it('should return origin string when length EQ max characters', (done: DoneFn) => {
        const exampleString = "Test string";
        const result = pipe.transform(exampleString, 11);
        expect(result).toBe(exampleString);
        done();
    });

    it('should return origin string when length LESS THEN max characters', (done: DoneFn) => {
        const exampleString = "Test string";
        const result = pipe.transform(exampleString, 15);
        expect(result).toBe(exampleString);
        done();
    });

    it('should return ellipsis string when length GREAT THEN max characters', (done: DoneFn) => {
        const result = pipe.transform("Test string", 5);
        expect(result).toBe("Te...");
        done();
    });

    it('should return origin string when it is UNDEFINED', (done: DoneFn) => {
        const result = pipe.transform(undefined, 5);
        expect(result).toBe(undefined);
        done();
    });

    it('should return origin string when it is NULL', (done: DoneFn) => {
        const result = pipe.transform(null, 5);
        expect(result).toBe(null);
        done();
    });

    it('should return origin string when it is EMPTY', (done: DoneFn) => {
        const result = pipe.transform("", 5);
        expect(result).toBe("");
        done();
    });

    it('should return origin string when max characters is ZERO', (done: DoneFn) => {
        const exampleString = "Test string";
        const result = pipe.transform(exampleString, 0);
        expect(result).toBe(exampleString);
        done();
    });

    it('should return origin string when max characters is UNDEFINED', (done: DoneFn) => {
        const exampleString = "Test string";
        const result = pipe.transform(exampleString, undefined);
        expect(result).toBe(exampleString);
        done();
    });

    it('should return origin string when max characters is NULL', (done: DoneFn) => {
        const exampleString = "Test string";
        const result = pipe.transform(exampleString, null);
        expect(result).toBe(exampleString);
        done();
    });

    it('should return origin string when max characters is NaN', (done: DoneFn) => {
        const exampleString = "Test string";
        const result = pipe.transform(exampleString, NaN);
        expect(result).toBe(exampleString);
        done();
    });

});