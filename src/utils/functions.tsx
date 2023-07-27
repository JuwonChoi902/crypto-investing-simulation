import { HeadersType, SymbolTickerTypes, CoinTypes } from '../typing/types';

export const makeHeader = (loginUserToken: string | null): HeadersType => {
  const headers: HeadersType = {
    'Content-Type': 'application/json;charset=utf-8',
  };

  if (loginUserToken) {
    headers.Authorization = `Bearer ${loginUserToken}`;
  } else {
    delete headers.Authorization;
  }

  return headers;
};

export const dateParsing = (date: string): [string, boolean] => {
  const theDate = new Date(date);
  const todayDate = new Date();
  const oneDayPlus = new Date(date);
  oneDayPlus.setDate(oneDayPlus.getDate() + 1);
  const isItInOneDay = oneDayPlus >= todayDate;
  return [
    `${theDate.getFullYear()}.${String(theDate.getMonth() + 1).padStart(2, '0')}.${String(
      theDate.getDate(),
    ).padStart(2, '0')}. ${String(theDate.getHours()).padStart(2, '0')}:${String(
      theDate.getMinutes(),
    ).padStart(2, '0')}`,
    isItInOneDay,
  ];
};

export const unitParsing = (num: string) => {
  const temp = Number(num);
  let [divideNum, resString, fractionDigit] = [1, '', 2];
  if (temp >= 1000000000) {
    [divideNum, resString] = [1000000000, 'B'];
  } else if (temp < 1000000000 && temp >= 1000000) {
    [divideNum, resString] = [1000000, 'M'];
  } else if (temp < 1000000 && temp >= 1000) {
    [divideNum, resString] = [1000, 'K'];
  } else fractionDigit = 4;

  return `${(temp / divideNum).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: fractionDigit,
  })}${resString}`;
};

export const testModules = {
  makeHeader,
  dateParsing,
  unitParsing,
};
