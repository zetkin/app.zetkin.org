'use client';

import { FC, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';

import { MessageList } from 'utils/locale';

type Props = {
  children: ReactNode;
  lang: string;
  messages: MessageList;
};

/**
 * Nests a narrower IntlProvider inside RootLayout's, scoped to a section
 * of the App Router tree. react-intl's IntlProvider doesn't merge messages
 * with an ancestor provider, so `messages` here must be the full set this
 * section needs, not just what it adds on top of the root.
 */
const SectionIntlProvider: FC<Props> = ({ children, lang, messages }) => (
  <IntlProvider defaultLocale="en" locale={lang} messages={messages}>
    {children}
  </IntlProvider>
);

export default SectionIntlProvider;
