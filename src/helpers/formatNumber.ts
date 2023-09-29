import BigNumber from 'bignumber.js';
type IBigNumberArg = string | number | BigNumber;

export const formatRoundFloorDisplay = (
  value: IBigNumberArg,
  decimalPlace = 4,
  shiftedBy = 0
): string => {
  return new BigNumber(value || 0)
    .shiftedBy(-shiftedBy)
    .decimalPlaces(decimalPlace, BigNumber.ROUND_FLOOR)
    .toFormat();
};

export const formatRoundFloorDisplayWithPrecision = (
  value: IBigNumberArg,
  decimalPlace = 4,
  shiftedBy = 0,
  decimalCount = 0
): string => {
  return new BigNumber(value || 0)
    .shiftedBy(-shiftedBy)
    .decimalPlaces(decimalPlace, BigNumber.ROUND_FLOOR)
    .toFormat(decimalCount);
};

export const nFormatter = (
  number: string,
  digits = 4,
  roundingMode?: BigNumber.RoundingMode
) => {
  const SI = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const num = parseFloat(number);
  let i;
  for (i = SI.length - 1; i > 0; i--) {
    if (num >= SI[i].value) {
      break;
    }
  }
  if (roundingMode) {
    return (
      new BigNumber(num)
        .div(SI[i].value)
        .toFixed(digits, roundingMode)
        .toString()
        .replace(rx, '$1') + SI[i].symbol
    );
  }

  return (num / SI[i].value).toFixed(digits).replace(rx, '$1') + SI[i].symbol;
};

export const formatPhoneNumber = (text: string) => {
  return text?.replace('+65', '(65) ');
};

export const formatLP = (text: string | number) => {
  return Math.floor(Number(text));
};

export const formatIndexTable = (
  idx: number,
  perPage: number,
  currentPage: number
) => {
  return idx + 1 + perPage * (currentPage - 1);
};
