import { FC, ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import PublicProjectLayout from 'features/organizations/layouts/PublicProjectLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinCampaign, ZetkinOrganization } from 'utils/types/zetkin';

type Props = {
  children: ReactNode;
  params: {
    orgId: number;
    projId: number;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const proj = await apiClient.get<ZetkinCampaign>(
    `/api/orgs/${params.orgId}/campaigns/${params.projId}`
  );

  return {
    icons: [{ url: '/logo-zetkin.png' }],
    title: proj.title,
  };
}

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const MyHomeLayout: FC<Props> = async ({ children, params }) => {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    const org = await apiClient.get<ZetkinOrganization>(
      `/api/orgs/${params.orgId}`
    );

    const proj = await apiClient.get<ZetkinCampaign>(
      `/api/orgs/${params.orgId}/campaigns/${params.projId}`
    );

    return (
      <HomeThemeProvider>
        <PublicProjectLayout org={org} proj={proj}>
          {children}
        </PublicProjectLayout>
      </HomeThemeProvider>
    );
  } catch (err) {
    return notFound();
  }
};

export default MyHomeLayout;
