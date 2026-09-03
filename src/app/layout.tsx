import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { headers } from 'next/headers';

import ClientContext from 'core/env/ClientContext';
import { getMessages } from 'utils/locale';
import { getRequestLang, getRequestUser } from 'utils/requestLocale';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);

  const user = await getRequestUser();
  const lang = await getRequestLang();

  const sharedBaseMessages = await getMessages(lang, ['core', 'glob', 'zui']);
  const nonce = headers().get('x-nonce') ?? undefined;

  return (
    <html lang="en">
      <head>
        <meta content={nonce} property={'csp-nonce'} />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ClientContext
            envVars={{
              FEAT_AREAS: process.env.FEAT_AREAS,
              FEAT_BULK_DELETE: process.env.FEAT_BULK_DELETE,
              FEAT_EMAIL_SETTINGS: process.env.FEAT_EMAIL_SETTINGS,
              FEAT_OFFICIALS: process.env.FEAT_OFFICIALS,
              FEAT_TASKS: process.env.FEAT_TASKS,
              FEAT_UNAUTH_EVENT_SIGNUP: process.env.FEAT_UNAUTH_EVENT_SIGNUP,
              INSTANCE_OWNER_HREF: process.env.INSTANCE_OWNER_HREF,
              INSTANCE_OWNER_NAME: process.env.INSTANCE_OWNER_NAME,
              MAPLIBRE_STYLE: process.env.MAPLIBRE_STYLE,
              MUIX_LICENSE_KEY: process.env.MUIX_LICENSE_KEY,
              TILESERVER: process.env.TILESERVER,
              ZETKIN_APP_DOMAIN: process.env.ZETKIN_APP_DOMAIN,
              ZETKIN_GEN2_CALL_URL: process.env.ZETKIN_GEN2_CALL_URL,
              ZETKIN_GEN2_ORGANIZE_URL: process.env.ZETKIN_GEN2_ORGANIZE_URL,
              ZETKIN_PRIVACY_POLICY_LINK:
                process.env.ZETKIN_PRIVACY_POLICY_LINK,
            }}
            headers={headersObject}
            lang={lang}
            messages={sharedBaseMessages}
            nonce={nonce}
            user={user}
          >
            {children}
          </ClientContext>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

export const dynamic = 'force-dynamic';
