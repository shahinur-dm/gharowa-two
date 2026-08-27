const banglaDigits: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

const englishDigits: { [key: string]: string } = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
};

export const toBanglaNumber = (num: number | string): string => {
  return num
    .toString()
    .split('')
    .map((char) => banglaDigits[char] || char)
    .join('');
};

export const toEnglishNumber = (str: string): string => {
  return str
    .split('')
    .map((char) => englishDigits[char] || char)
    .join('');
};

export const formatBDT = (amount: number, useBangla = true): string => {
  if (useBangla) {
    return `৳${toBanglaNumber(amount)}`;
  }
  return `৳${amount.toLocaleString('en-BD')}`;
};

export const generateOrderNumber = (): string => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `GH-${random}`;
};

export const generateReservationNumber = (): string => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `RES-${random}`;
};
