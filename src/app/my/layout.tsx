import { FC, ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import HomeLayout from 'features/home/layouts/HomeLayout';
import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import { getBrowserLanguage } from 'utils/locale';
import getServerMessages from 'core/i18n/server';
import messageIds from 'features/home/l10n/messageIds';

export async function generateMetadata(): Promise<Metadata> {
  const lang = getBrowserLanguage(headers().get('accept-language') || '');
  const messages = await getServerMessages(lang, messageIds);

  return {
    title: process.env.HOME_TITLE || messages.title(),
  };
}

type Props = {
  children: ReactNode;
};

const MyHomeLayout: FC<Props> = ({ children }) => {
  const homeTitle = process.env.HOME_TITLE;

  return (
    <HomeThemeProvider>
      <HomeLayout title={homeTitle}>{children}</HomeLayout>
    </HomeThemeProvider>
  );
};

export default MyHomeLayout;
