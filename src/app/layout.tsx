import { headers } from 'next/headers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = headers().get('x-next-intl-locale') || 'en';

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
