import { FC, ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import HomeThemeProvider from 'features/my/components/HomeThemeProvider';
import PublicOrgLayout from 'features/public/layouts/PublicOrgLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { getOrganizationOpenGraphTags, getSeoTags } from 'utils/seoTags';
import { ApiClientError } from 'core/api/errors';

type Props = {
  children: ReactNode;
  params: Promise<{
    orgId: number;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    const org = await apiClient.get<ZetkinOrganization>(
      `/api/orgs/${params.orgId}`
    );

    const baseTags = getSeoTags(org.title, '', `/o/${org.id}`);
    return {
      ...baseTags,
      openGraph: {
        ...baseTags.openGraph,
        ...getOrganizationOpenGraphTags(org),
      },
      robots: { follow: true, index: org.is_public },
    };
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 404) {
      notFound();
    }
    throw e;
  }
}

const OrgLayout: FC<Props> = async (props) => {
  const params = await props.params;

  const { children } = props;

  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    const org = await apiClient.get<ZetkinOrganization>(
      `/api/orgs/${params.orgId}`
    );

    return (
      <HomeThemeProvider>
        <PublicOrgLayout org={org}>{children}</PublicOrgLayout>
      </HomeThemeProvider>
    );
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 404) {
      notFound();
    }
    throw e;
  }
};

export default OrgLayout;
