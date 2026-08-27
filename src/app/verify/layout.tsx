import { ReactNode } from 'react';

import HomeThemeProvider from 'features/my/components/HomeThemeProvider';
import AccountLayout from 'features/account/layouts/AccountLayout';
import { getMessages } from 'utils/locale';
import { getRequestLang } from 'utils/requestLocale';
import SectionIntlProvider from 'core/env/SectionIntlProvider';

type Props = {
  children: ReactNode;
};

export default async function VerifyLayout({ children }: Props) {
  const lang = await getRequestLang();
  const messages = await getMessages(lang, ['feat.account']);

  return (
    <SectionIntlProvider lang={lang} messages={messages}>
      <HomeThemeProvider>
        <AccountLayout>{children}</AccountLayout>
      </HomeThemeProvider>
    </SectionIntlProvider>
  );
}
