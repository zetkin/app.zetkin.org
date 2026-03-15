import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

import { getFilteredMessages } from 'i18n/pickMessages';

type Props = {
  children: ReactNode;
};

export default async function UnsubscribedLayout({ children }: Props) {
  const messages = await getFilteredMessages('feat.emails');

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
