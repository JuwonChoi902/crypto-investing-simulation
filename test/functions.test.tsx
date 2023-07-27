import { testModules } from '../src/utils/functions';

describe('should pass all function tests', () => {
  test('makeHeader function should work correctly', () => {
    const makeHeaderTestCase = [
      {
        loginUserToken: 'mockAccessToken',
        expected: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: 'Bearer mockAccessToken',
        },
      },
      {
        loginUserToken: null,
        expected: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      },
    ];
    makeHeaderTestCase.forEach((test) => {
      expect(testModules.makeHeader(test.loginUserToken)).toEqual(test.expected);
    });
  });

  test('unitParsing funciton should work correctly', () => {
    const unitParsingTestCase = [
      { input: '1500000000', expected: '1.50B' },
      { input: '2300000', expected: '2.30M' },
      { input: '9800', expected: '9.80K' },
      { input: '500', expected: '500.00' },
      { input: '3500000.12345', expected: '3.50M' },
      { input: '4567890123.456', expected: '4.57B' },
      { input: '999999999999', expected: '1,000.00B' },
    ];

    unitParsingTestCase.forEach((test) => {
      expect(testModules.unitParsing(test.input)).toBe(test.expected);
    });
  });

  test('dateParsing function should work correctly', () => {
    const dateParsingTestCase = [
      {
        input: '2023-07-25T04:28:00.893Z',
        expected: ['2023.07.25. 13:28', true],
      },
      {
        input: '2023-07-23T09:00:00',
        expected: ['2023.07.23. 09:00', false],
      },
    ];

    dateParsingTestCase.forEach((test) => {
      expect(testModules.dateParsing(test.input)).toEqual(test.expected);
    });
  });
});
