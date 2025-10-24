import { FC, ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinCampaign } from 'utils/types/zetkin';
import PublicProjectLayout from 'features/campaigns/layout/PublicProjectLayout';
import { getOrganizationOpenGraphTags, getSeoTags } from 'utils/seoTags';

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

  const campaign = await apiClient.get<ZetkinCampaign>(
    `/api/orgs/${params.orgId}/campaigns/${params.projId}`
  );

  const baseTags = getSeoTags(
    `${campaign.title} | ${campaign.organization.title}`,
    campaign.info_text,
    `/o/${campaign.organization.id}/projects/${campaign.id}`
  );
  return {
    ...baseTags,
    openGraph: {
      ...baseTags.openGraph,
      ...getOrganizationOpenGraphTags(campaign.organization),
    },
    robots: { follow: true, index: campaign.published },
  };
}

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const MyHomeLayout: FC<Props> = async ({ children, params }) => {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    const campaign = await apiClient.get<ZetkinCampaign>(
      `/api/orgs/${params.orgId}/campaigns/${params.projId}`
    );

    return (
      <HomeThemeProvider>
        <PublicProjectLayout campaign={campaign}>
          {children}
        </PublicProjectLayout>
      </HomeThemeProvider>
    );
  } catch (err) {
    return notFound();
  }
};

export default MyHomeLayout;
