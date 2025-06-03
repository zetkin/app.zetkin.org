export const SUPPORTED_LANGUAGES = [
  'en',
  'da',
  'sv',
  'de',
  'nn',
  'nl',
] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
