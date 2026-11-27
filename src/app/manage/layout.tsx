import { FC, ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import HomeThemeProvider from 'features/my/components/HomeThemeProvider';
import ManageLayout from 'features/manage/layouts/ManageLayout';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import ManageLayoutNotAllowed from 'features/manage/layouts/ManageLayoutNotAllowed';
import { getSeoTags } from 'utils/seoTags';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-requested-path') || '';

  return {
    ...getSeoTags(
      `Manage | ${process.env.HOME_TITLE || 'Zetkin'}`,
      '',
      pathname
    ),
    robots: { follow: false, index: false },
  };
}

type Props = {
  children: ReactNode;
};

const Layout: FC<Props> = async ({ children }) => {
  const user = await redirectIfLoginNeeded({ allowUnverified: false }, 2);
  if (!user.is_superuser) {
    return (
      <HomeThemeProvider>
        <ManageLayoutNotAllowed />
      </HomeThemeProvider>
    );
  }

  const title = `Manage ${process.env.HOME_TITLE ?? 'Zetkin'}`;
  const headersList = await headers();
  const pathname = headersList.get('x-requested-path') || '';

  return (
    <HomeThemeProvider>
      <ManageLayout pathname={pathname} title={title}>
        {children}
      </ManageLayout>
    </HomeThemeProvider>
  );
};

export default Layout;
