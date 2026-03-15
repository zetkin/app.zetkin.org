import { readFileSync } from 'fs';
import path from 'path';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

// Cache compiled messages in memory — loaded once per locale per process
const messageCache: Record<string, Record<string, unknown>> = {};

function loadMessages(locale: string): Record<string, unknown> {
  if (!messageCache[locale]) {
    const filePath = path.join(
      process.cwd(),
      'src',
      'locale',
      'compiled',
      `${locale}.json`
    );
    messageCache[locale] = JSON.parse(readFileSync(filePath, 'utf8'));
  }
  return messageCache[locale];
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (
    !locale ||
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: loadMessages(locale),
    onError(error) {
      if (error.code === 'MISSING_MESSAGE') {
        throw new Error(
          `Missing translation: ${error.originalMessage}. ` +
            'Either add it to the YAML locale files or add the correct ' +
            'namespace to localeScope in the scaffold options.'
        );
      }
      // Re-throw all other errors
      throw error;
    },
  };
});
