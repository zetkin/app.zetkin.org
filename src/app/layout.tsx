import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import ClientContext from 'core/env/ClientContext';
import { ZetkinUser, ZetkinSession } from 'utils/types/zetkin';
import { getBrowserLanguage, getMessages } from 'utils/locale';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = getBrowserLanguage(headers().get('accept-language') || '');
  const messages = await getMessages(lang);

  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  let user: ZetkinUser | null;
  let session: ZetkinSession | null;

  try {
    session = await apiClient.get<ZetkinSession>('/api/session');
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (e) {
    user = null;
    session = null;
  }

  // Check if user is logged in but not properly verified based on auth factors
  const path = headersList.get('x-requested-path') || '';

  if (user && session && session.factors && !path.startsWith('/verify')) {
    const hasPhoneAuth = session.factors.includes('phone_otp');
    const hasEmailAuth = session.factors.includes('email_password');

    // Only redirect to email verification if user used email authentication
    // and their email is not verified. Phone-only authentication is fine.
    if (hasEmailAuth && !user.email_is_verified) {
      redirect('/verify');
    }
  }

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ClientContext
            envVars={{
              FEAT_AREAS: process.env.FEAT_AREAS,
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
