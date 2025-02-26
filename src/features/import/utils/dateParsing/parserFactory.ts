import { AnyFormatDateParser } from './AnyFormatDateParser';
import { DanishCprParser } from './DanishCprParser';
import { NorwegianFnrParser } from './NorwegianFnrParser';
import { SwedishPnrParser } from './SwedishPnrParser';

export default function parserFactory(format: string) {
  const anyFormatDateParser = new AnyFormatDateParser(format);
  const swedishPnrParser = new SwedishPnrParser();
  const danishCprParser = new DanishCprParser();
  const norwegianFnrParser = new NorwegianFnrParser();

  if (format == 'se') {
    return swedishPnrParser;
  } else if (format == 'no') {
    return norwegianFnrParser;
  } else if (format == 'dk') {
    return danishCprParser;
  } else {
    return anyFormatDateParser;
  }
}
