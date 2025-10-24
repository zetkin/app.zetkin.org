import { FC, ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import HomeLayout from 'features/home/layouts/HomeLayout';
import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import { getBrowserLanguage } from 'utils/locale';
import getServerMessages from 'core/i18n/server';
import messageIds from 'features/home/l10n/messageIds';
import { getSeoTags } from '../../utils/seoTags';

export async function generateMetadata(): Promise<Metadata> {
  const lang = getBrowserLanguage(headers().get('accept-language') || '');
  const messages = await getServerMessages(lang, messageIds);

  const headersList = headers();
  const pathname = headersList.get('x-requested-path') || '';
  const lastSegment = pathname.split('/').pop() ?? 'home';

  let pageTitle = '';
  let description = '';

  if (lastSegment === 'feed') {
    pageTitle = messages.tabs.feed();
    description = messages.allEventsList.seoDescription();
  } else if (lastSegment === 'home') {
    pageTitle = messages.tabs.home();
    description = messages.activityList.seoDescription();
  } else if (lastSegment === 'settings') {
    pageTitle = messages.tabs.settings();
    description = messages.settings.seoDescription();
  }

  return getSeoTags(
    `${pageTitle} | ${process.env.HOME_TITLE || messages.title()}`,
    description,
    pathname
  );
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
