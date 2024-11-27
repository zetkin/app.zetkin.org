import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';

import { CellData } from '../types';
import { SwedishPnrParser } from './SwedishPnrParser';
import { DanishCprParser } from './DanishCprParser';
import { NorwegianFnrParser } from './NorwegianFnrParser';
import { AnyFormatDateParser } from './AnyFormatDateParser';

dayjs.extend(customParseFormat);

export default function parseDate(value: CellData, format: string) {
  if (!value) {
    return '';
  }

  const stringValue = value.toString();

  if (format === 'se') {
    const parser = new SwedishPnrParser();
    return parser.parse(stringValue);
  } else if (format == 'dk') {
    const parser = new DanishCprParser();
    return parser.parse(stringValue);
  } else if (format == 'no') {
    const parser = new NorwegianFnrParser();
    return parser.parse(stringValue);
  } else {
    const parser = new AnyFormatDateParser(format);
    return parser.parse(stringValue);
  }
}
