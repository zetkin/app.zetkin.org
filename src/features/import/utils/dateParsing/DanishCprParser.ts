import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';

import { DateParts, IDateParser } from './types';
import { AnyFormatDateParser, makeDate } from './AnyFormatDateParser';

dayjs.extend(customParseFormat);

export class DanishCprParser implements IDateParser {
  makeDateParts(value: string): DateParts | null {
    let idNumber = '';
    let idNumberSeparator = '';

    const separator = value.slice(-5, -4);
    if (isNaN(parseInt(separator))) {
      idNumberSeparator = separator;
    }

    idNumber = value.slice(-4);

    const parsedDate = dayjs(value, 'DDMMYY');

    if (!parsedDate.isValid()) {
      return null;
    }

    const date = parsedDate.toDate();
    const month = date.getMonth() + 1;

    return {
      day: date.getDate().toString().padStart(2, '0'),
      delimiter: idNumberSeparator,
      month: month.toString().padStart(2, '0'),
      suffix: idNumber,
      year: date.getFullYear().toString(),
    };
  }

  parse(value: string): string {
    const parser = new AnyFormatDateParser('DDMMYY');
    return parser.parse(value);
  }

  validate(value: string | number): boolean {
    const stringValue = value.toString();

    const dateParts = this.makeDateParts(stringValue);

    if (!dateParts) {
      return false;
    }

    const dateString =
      makeDate('DDMMYY', dateParts) + dateParts.delimiter + dateParts.suffix;

    return dateString == stringValue;
  }
}
