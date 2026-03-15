import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

import HomeThemeProvider from 'features/my/components/HomeThemeProvider';
import AccountLayout from 'features/account/layouts/AccountLayout';
import { getFilteredMessages } from 'i18n/pickMessages';

type Props = {
  children: ReactNode;
};

export default async function ResetPasswordLayout({ children }: Props) {
  const messages = await getFilteredMessages('feat.account');

  return (
    <NextIntlClientProvider messages={messages}>
      <HomeThemeProvider>
        <AccountLayout>{children}</AccountLayout>
      </HomeThemeProvider>
    </NextIntlClientProvider>
  );
}
