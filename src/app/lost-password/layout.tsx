import { FC, ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import { getBrowserLanguage } from 'utils/locale';
import getServerMessages from 'core/i18n/server';
import messageIds from 'features/home/l10n/messageIds';
import AccountLayout from 'features/account/layouts/AccountLayout';

export async function generateMetadata(): Promise<Metadata> {
  const lang = getBrowserLanguage(headers().get('accept-language') || '');
  const messages = await getServerMessages(lang, messageIds);

  return {
    icons: [{ url: '/logo-zetkin.png' }],
    title: process.env.HOME_TITLE || messages.title(),
  };
}

type Props = {
  children: ReactNode;
};

const MyHomeLayout: FC<Props> = ({ children }) => {
  return (
    <HomeThemeProvider>
      <AccountLayout>{children}</AccountLayout>
    </HomeThemeProvider>
  );
};

export default MyHomeLayout;
