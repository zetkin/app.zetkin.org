import { ReactNode } from 'react';

import ScopedIntlProvider from 'core/i18n/ScopedIntlProvider';
import { getFilteredMessages } from 'i18n/pickMessages';

type Props = {
  children: ReactNode;
};

export default async function CanvassLayout({ children }: Props) {
  const messages = await getFilteredMessages(
    'feat.canvass',
    'feat.organizations'
  );

  return (
    <ScopedIntlProvider messages={messages}>{children}</ScopedIntlProvider>
  );
}
