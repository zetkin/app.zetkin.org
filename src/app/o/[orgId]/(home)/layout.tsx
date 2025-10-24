import { FC, ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import PublicOrgLayout from 'features/organizations/layouts/PublicOrgLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { getBrowserLanguage } from 'utils/locale';
import getServerMessages from 'core/i18n/server';
import messageIds from 'features/organizations/l10n/messageIds';
import { getOrganizationOpenGraphTags, getSeoTags } from 'utils/seoTags';

type Props = {
  children: ReactNode;
  params: {
    orgId: number;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const lang = getBrowserLanguage(headersList.get('accept-language') || '');
  const messages = await getServerMessages(lang, messageIds);

  const org = await apiClient.get<ZetkinOrganization>(
    `/api/orgs/${params.orgId}`
  );

  const description = messages.home.seoDescription({ org: org.title });

  const baseTags = getSeoTags(org.title, description, `/o/${org.id}`);
  return {
    ...baseTags,
    openGraph: {
      ...baseTags.openGraph,
      ...getOrganizationOpenGraphTags(org),
    },
    robots: { follow: true, index: org.is_public },
  };
}

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const OrgLayout: FC<Props> = async ({ children, params }) => {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const org = await apiClient.get<ZetkinOrganization>(
    `/api/orgs/${params.orgId}`
  );

  return (
    <HomeThemeProvider>
      <PublicOrgLayout org={org}>{children}</PublicOrgLayout>
    </HomeThemeProvider>
  );
};

export default OrgLayout;
