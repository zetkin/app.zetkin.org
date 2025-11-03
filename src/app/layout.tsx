import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import ClientContext from 'core/env/ClientContext';
import { ZetkinUser } from 'utils/types/zetkin';
import { getBrowserLanguage, getMessages } from 'utils/locale';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const lang =
    user?.lang || getBrowserLanguage(headers().get('accept-language') || '');
  const messages = await getMessages(lang);

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ClientContext
            envVars={{
              FEAT_AREAS: process.env.FEAT_AREAS,
              FEAT_HOUSEHOLDS2: process.env.FEAT_HOUSEHOLDS2,
              FEAT_OFFICIALS: process.env.FEAT_OFFICIALS,
              FEAT_TASKS: process.env.FEAT_TASKS,
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
            lang={lang}
            messages={messages}
            user={user}
          >
            {children}
          </ClientContext>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
