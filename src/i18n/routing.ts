import { defineRouting } from 'next-intl/routing';

import { DEFAULT_LOCALE, LOCALES } from './config';

export const routing = defineRouting({
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'never',
  locales: LOCALES,
});
