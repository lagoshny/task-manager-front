import { DateUtils } from './date.utils';

describe('DateUtils', () => {
  it('should return 1 minute when pass 1', (done: DoneFn) => {
    const expectedString = '1 minute';
    const result = DateUtils.getMinutesAsString(1);
    expect(result).toBe(expectedString);
    done();
  });

  it('should return 10 minutes when pass 10', (done: DoneFn) => {
    const expectedString = '10 minutes';
    const result = DateUtils.getMinutesAsString(10);
    expect(result).toBe(expectedString);
    done();
  });

  it('should return 21 minute when pass 21', (done: DoneFn) => {
    const expectedString = '21 minute';
    const result = DateUtils.getMinutesAsString(21);
    expect(result).toBe(expectedString);
    done();
  });

  it('should return 0 minutes when pass 0', (done: DoneFn) => {
    const expectedString = '0 minutes';
    const result = DateUtils.getMinutesAsString(0);
    expect(result).toBe(expectedString);
    done();
  });

  it('should return EMPTY string when pass NULL', (done: DoneFn) => {
    const expectedString = '';
    const result = DateUtils.getMinutesAsString(null);
    expect(result).toBe(expectedString);
    done();
  });

  it('should return EMPTY string when pass UNDEFINED', (done: DoneFn) => {
    const expectedString = '';
    const result = DateUtils.getMinutesAsString(undefined);
    expect(result).toBe(expectedString);
    done();
  });


  it('should return EMPTY string when pass NaN', (done: DoneFn) => {
    const expectedString = '';
    const result = DateUtils.getMinutesAsString(NaN);
    expect(result).toBe(expectedString);
    done();
  });
});
