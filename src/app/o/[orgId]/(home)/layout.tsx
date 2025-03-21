import { FC, ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import { getBrowserLanguage } from 'utils/locale';
import getServerMessages from 'core/i18n/server';
import messageIds from 'features/home/l10n/messageIds';
import OrgHomeLayout from 'features/organizations/layouts/OrgHomeLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';

export async function generateMetadata(): Promise<Metadata> {
  const lang = getBrowserLanguage(headers().get('accept-language') || '');
  const messages = await getServerMessages(lang, messageIds);

  return {
    icons: [{ url: '/logo-zetkin.png' }],
    title: process.env.HOME_TITLE || messages.title(),
  };
}

type Props = {
  children: ReactNode;
  params: {
    orgId: number;
  };
};

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const MyHomeLayout: FC<Props> = async ({ children, params }) => {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const org = await apiClient.get<ZetkinOrganization>(
    `/api/orgs/${params.orgId}`
  );

  return (
    <HomeThemeProvider>
      <OrgHomeLayout org={org}>{children}</OrgHomeLayout>
    </HomeThemeProvider>
  );
};

export default MyHomeLayout;
