export const SUPPORTED_LANGUAGES = [
  'en',
  'da',
  'sv',
  'de',
  'nn',
  'nl',
  'cs',
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
