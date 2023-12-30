'use client';

import BrowserApiClient from 'core/api/client/BrowserApiClient';
import createStore from 'core/store';
import Environment from 'core/env/Environment';
import { EnvProvider } from 'core/env/EnvContext';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';

export type EnvWrapperProps = {
  children: React.ReactNode;
};

export default function EnvWrapper({ children }: EnvWrapperProps) {
  const store = createStore();
  const env = new Environment(store, new BrowserApiClient());
  const lang = 'sv';
  const messages = {};
  return (
    <ReduxProvider store={store}>
      <EnvProvider env={env}>
        <IntlProvider defaultLocale="en" locale={lang} messages={messages}>
          {children}
        </IntlProvider>
      </EnvProvider>
    </ReduxProvider>
  );
}
