export const LOCALES = ['en', 'da', 'sv', 'de', 'nn', 'nl'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
