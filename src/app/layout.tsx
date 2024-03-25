import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import BackendApiClient from 'core/api/client/BackendApiClient';
import ClientContext from 'core/env/ClientContext';
import { headers } from 'next/headers';
import { ZetkinUser } from 'utils/types/zetkin';
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
  try {
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (e) {
    user = null;
  }

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ClientContext lang={lang} messages={messages} user={user}>
            {children}
          </ClientContext>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
