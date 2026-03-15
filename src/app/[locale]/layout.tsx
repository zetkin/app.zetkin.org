import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { NextIntlClientProvider } from 'next-intl';
import { headers } from 'next/headers';
import { setRequestLocale } from 'next-intl/server';

import { getFilteredMessages } from 'i18n/pickMessages';
import BackendApiClient from 'core/api/client/BackendApiClient';
import ClientContext from 'core/env/ClientContext';
import { LOCALES } from 'i18n/config';
import { ZetkinUser } from 'utils/types/zetkin';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;
  setRequestLocale(locale);

  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  let user: ZetkinUser | null;

  try {
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (e) {
    user = null;
  }

  // Only pass shared base messages at root level.
  // Section layouts add their own scoped messages via nested providers.
  const messages = await getFilteredMessages();

  return (
    <AppRouterCacheProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ClientContext
          envVars={{
            FEAT_AREAS: process.env.FEAT_AREAS,
            FEAT_OFFICIALS: process.env.FEAT_OFFICIALS,
            FEAT_TASKS: process.env.FEAT_TASKS,
            FEAT_UNAUTH_EVENT_SIGNUP: process.env.FEAT_UNAUTH_EVENT_SIGNUP,
            INSTANCE_OWNER_HREF: process.env.INSTANCE_OWNER_HREF,
            INSTANCE_OWNER_NAME: process.env.INSTANCE_OWNER_NAME,
            MAPLIBRE_STYLE: process.env.MAPLIBRE_STYLE,
            MUIX_LICENSE_KEY: process.env.MUIX_LICENSE_KEY,
            TILESERVER: process.env.TILESERVER,
            ZETKIN_APP_DOMAIN: process.env.ZETKIN_APP_DOMAIN,
            ZETKIN_GEN2_ORGANIZE_URL: process.env.ZETKIN_GEN2_ORGANZE_URL,
            ZETKIN_PRIVACY_POLICY_LINK:
              process.env.ZETKIN_PRIVACY_POLICY_LINK,
          }}
          headers={headersObject}
          lang={locale}
          user={user}
        >
          {children}
        </ClientContext>
      </NextIntlClientProvider>
    </AppRouterCacheProvider>
  );
}
