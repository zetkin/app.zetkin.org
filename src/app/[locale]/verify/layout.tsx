import { ReactNode } from 'react';

import ScopedIntlProvider from 'core/i18n/ScopedIntlProvider';
import HomeThemeProvider from 'features/my/components/HomeThemeProvider';
import AccountLayout from 'features/account/layouts/AccountLayout';
import { getFilteredMessages } from 'i18n/pickMessages';

type Props = {
  children: ReactNode;
};

export default async function VerifyLayout({ children }: Props) {
  const messages = await getFilteredMessages('feat.account');

  return (
    <ScopedIntlProvider messages={messages}>
      <HomeThemeProvider>
        <AccountLayout>{children}</AccountLayout>
      </HomeThemeProvider>
    </ScopedIntlProvider>
  );
}
