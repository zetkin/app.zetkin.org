import dayjs from 'dayjs';

import { DateParts, IDateParser } from './types';
import placeInCorrectCentury from './placeInCorrectCentury';

export function makeDate(format: string, dateParts: DateParts) {
  let dateString = format;

  dateString = dateString.replace('DD', dateParts.day);
  dateString = dateString.replace('MM', dateParts.month);
  if (format.includes('YYYY')) {
    dateString = dateString.replace('YYYY', dateParts.year);
  } else {
    dateString = dateString.replace('YY', dateParts.year.slice(2));
  }

  return dateString;
}

export class AnyFormatDateParser implements IDateParser {
  constructor(private format: string) {
    this.format = format;
  }

  makeDateParts(value: string): DateParts | null {
    const parsedDate = dayjs(value.toString(), this.format);

    if (!parsedDate.isValid()) {
      return null;
    }

    const date = parsedDate.toDate();

    if (!this.format.includes('YYYY')) {
      placeInCorrectCentury(date);
    }

    const month = date.getMonth() + 1;

    return {
      day: date.getDate().toString().padStart(2, '0'),
      delimiter: '',
      month: month.toString().padStart(2, '0'),
      suffix: '',
      year: date.getFullYear().toString(),
    };
  }

  parse(value: string): string {
    const dateParts = this.makeDateParts(value);

    if (!dateParts) {
      return '';
    }

    return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  }

  validate(value: string | number): boolean {
    const stringValue = value.toString();
    const dateParts = this.makeDateParts(stringValue);

    if (!dateParts) {
      return false;
    }

    const dateString = makeDate(this.format, dateParts);

    return dateString == stringValue;
  }
}
