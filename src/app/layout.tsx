import ClientContext from 'core/env/ClientContext';
import { headers } from 'next/headers';
import { getBrowserLanguage, getMessages } from 'utils/locale';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = getBrowserLanguage(headers().get('accept-language') || '');
  const messages = await getMessages(lang);
  return (
    <html lang="en">
      <body>
        <ClientContext lang={lang} messages={messages}>
          {children}
        </ClientContext>
      </body>
    </html>
  );
}
