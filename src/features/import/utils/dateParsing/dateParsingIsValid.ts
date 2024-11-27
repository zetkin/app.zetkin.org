import { SwedishPnrParser } from './SwedishPnrParser';
import { NorwegianFnrParser } from './NorwegianFnrParser';
import { DanishCprParser } from './DanishCprParser';
import { AnyFormatDateParser } from './AnyFormatDateParser';

export default function dateParsingIsValid(
  value: string | number,
  format: string
) {
  if (format == 'se') {
    const parser = new SwedishPnrParser();
    return parser.validate(value);
  } else if (format == 'no') {
    const parser = new NorwegianFnrParser();
    return parser.validate(value);
  } else if (format == 'dk') {
    const parser = new DanishCprParser();
    return parser.validate(value);
  } else {
    const parser = new AnyFormatDateParser(format);
    return parser.validate(value);
  }
}
