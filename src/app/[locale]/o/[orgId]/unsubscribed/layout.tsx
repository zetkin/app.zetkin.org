import { ReactNode } from 'react';

import ScopedIntlProvider from 'core/i18n/ScopedIntlProvider';
import { getFilteredMessages } from 'i18n/pickMessages';

type Props = {
  children: ReactNode;
};

export default async function UnsubscribedLayout({ children }: Props) {
  const messages = await getFilteredMessages('feat.emails');

  return (
    <ScopedIntlProvider messages={messages}>
      {children}
    </ScopedIntlProvider>
  );
}
