'use client';

import { FC, ReactNode } from 'react';
import { NextIntlClientProvider, useLocale } from 'next-intl';

type ScopedIntlProviderProps = {
  children: ReactNode;
  messages: Record<string, unknown>;
};

/**
 * Client-side wrapper for App Router section layouts. Mirrors the
 * fail-loudly onError configured in `src/i18n/request.ts` for the server:
 * any client-side translation lookup outside the page's `localeScope`
 * throws instead of silently rendering the message key.
 *
 * Use this in every section layout that scopes its messages, e.g.
 *   <ScopedIntlProvider messages={messages}>{children}</ScopedIntlProvider>
 */
const ScopedIntlProvider: FC<ScopedIntlProviderProps> = ({
  children,
  messages,
}) => {
  const locale = useLocale();

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={(error) => {
        // Skip during static prerendering when the messages payload is empty.
        const hasMessages = messages && Object.keys(messages).length > 0;
        if (hasMessages && error.code === 'MISSING_MESSAGE') {
          throw new Error(
            `Missing translation: ${error.message}. ` +
              'Add the correct namespace to localeScope.'
          );
        }
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
};

export default ScopedIntlProvider;
