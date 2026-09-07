import { ReactNode } from 'react';

import { getMessages } from 'utils/locale';
import { getRequestLang } from 'utils/requestLocale';
import SectionIntlProvider from 'core/env/SectionIntlProvider';

type Props = {
  children: ReactNode;
};

export default async function UnsubscribedLayout({ children }: Props) {
  const lang = await getRequestLang();
  const messages = await getMessages(lang, ['feat.emails']);

  return (
    <SectionIntlProvider lang={lang} messages={messages}>
      {children}
    </SectionIntlProvider>
  );
}
