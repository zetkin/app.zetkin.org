import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';

import { CellData } from './types';
import { makeNaiveDateString } from 'utils/dateUtils';

dayjs.extend(customParseFormat);

const placeInCorrectCentury = (date: Date) => {
  const thisYear = new Date().getFullYear();

  //This cutoff is to calculate a date window of 100 years,
  //so we can decide which century a 2-digit year belongs to.
  //It seems unlikely users will import people who are older than 110 years of age.
  const cutoff = thisYear - 110;

  const year = date.getFullYear();

  if (year - cutoff > thisYear - cutoff) {
    date.setFullYear(year - 100);
  }
};

export default function parseDate(value: CellData, format: string) {
  if (!value) {
    return '';
  }

  const stringValue = value.toString();

  let dateFormat = '';
  if (format === 'se') {
    const datePart = stringValue.replace(/\D/g, '').slice(0, -4);
    if (datePart.length > 6) {
      dateFormat = 'YYYYMMDD';
    } else {
      dateFormat = 'YYMMDD';
    }
  } else if (format == 'dk' || format == 'no') {
    dateFormat = 'DDMMYY';
  } else {
    dateFormat = format;
  }

  const parsedDate = dayjs(stringValue, dateFormat);

  if (!parsedDate.isValid()) {
    return '';
  }

  const date = parsedDate.toDate();
  placeInCorrectCentury(date);

  return makeNaiveDateString(date);
}
