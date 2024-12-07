import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';

import placeInCorrectCentury from './placeInCorrectCentury';
import { DateParts, IDateParser } from './types';
import { AnyFormatDateParser, makeDate } from './AnyFormatDateParser';

dayjs.extend(customParseFormat);

export class SwedishPnrParser implements IDateParser {
  private _eightDigitParser: IDateParser;
  private _sixDigitParser: IDateParser;

  constructor() {
    this._eightDigitParser = new AnyFormatDateParser('YYYYMMDD');
    this._sixDigitParser = new AnyFormatDateParser('YYMMDD');
  }

  private getFormat(value: string) {
    const datePart = value.toString().replace(/\D/g, '').slice(0, -4);
    return datePart.length > 6 ? 'YYYYMMDD' : 'YYMMDD';
  }

  makeDateParts(value: string): DateParts | null {
    const format = this.getFormat(value);
    let idNumber = '';
    let idNumberSeparator = '';

    const separator = value.slice(-5, -4);
    if (isNaN(parseInt(separator))) {
      idNumberSeparator = separator;
    }

    idNumber = value.slice(-4);

    const parsedDate = dayjs(value, format);

    if (!parsedDate.isValid()) {
      return null;
    }

    const date = parsedDate.toDate();

    if (!format.includes('YYYY')) {
      placeInCorrectCentury(date);
    }

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
    const format = this.getFormat(value);

    return format.includes('YYYY')
      ? this._eightDigitParser.parse(value)
      : this._sixDigitParser.parse(value);
  }

  validate(value: string | number): boolean {
    const stringValue = value.toString();
    const format = this.getFormat(stringValue);
    const dateParts = this.makeDateParts(stringValue);

    if (!dateParts) {
      return false;
    }

    const dateString =
      makeDate(format, dateParts) + dateParts.delimiter + dateParts.suffix;

    return dateString == stringValue;
  }
}
