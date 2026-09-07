import { ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import HomeLayout from 'features/my/layouts/HomeLayout';
import HomeThemeProvider from 'features/my/components/HomeThemeProvider';
import { getBrowserLanguage, getMessages } from 'utils/locale';
import { getRequestLang } from 'utils/requestLocale';
import getServerMessages from 'core/i18n/server';
import messageIds from 'features/my/l10n/messageIds';
import SectionIntlProvider from 'core/env/SectionIntlProvider';
import { getSeoTags } from '../../utils/seoTags';

export async function generateMetadata(): Promise<Metadata> {
  const lang = getBrowserLanguage(headers().get('accept-language') || '');
  const messages = await getServerMessages(lang, messageIds);

  const headersList = headers();
  const pathname = headersList.get('x-requested-path') || '';
  const lastSegment = pathname.split('/').pop() ?? 'home';

  let pageTitle = '';

  if (lastSegment === 'feed') {
    pageTitle = messages.tabs.feed();
  } else if (lastSegment === 'home') {
    pageTitle = messages.tabs.home();
  } else if (lastSegment === 'settings') {
    pageTitle = messages.tabs.settings();
  } else if (lastSegment === 'orgs') {
    pageTitle = messages.tabs.orgs();
  }

  const baseTags = getSeoTags(
    `${pageTitle} | ${process.env.HOME_TITLE || messages.title()}`,
    '',
    pathname
  );
  return {
    ...baseTags,
    robots: { follow: true, index: false },
  };
}

type Props = {
  children: ReactNode;
};

export default async function MyHomeLayout({ children }: Props) {
  const homeTitle = process.env.HOME_TITLE;
  const lang = await getRequestLang();
  const messages = await getMessages(lang, [
    'feat.events',
    'feat.home',
    'feat.organizations',
  ]);

  return (
    <SectionIntlProvider lang={lang} messages={messages}>
      <HomeThemeProvider>
        <HomeLayout title={homeTitle}>{children}</HomeLayout>
      </HomeThemeProvider>
    </SectionIntlProvider>
  );
}
