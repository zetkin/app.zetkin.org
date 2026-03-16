import { FC, ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import HomeThemeProvider from 'features/my/components/HomeThemeProvider';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ApiClientError } from 'core/api/errors';
import { ZetkinProject } from 'utils/types/zetkin';
import PublicProjectLayout from 'features/public/layouts/PublicProjectLayout';
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

  const project = await apiClient.get<ZetkinProject>(
    `/api/orgs/${params.orgId}/campaigns/${params.projId}`
  );

  const baseTags = getSeoTags(
    `${project.title} | ${project.organization.title}`,
    project.info_text,
    `/o/${project.organization.id}/projects/${project.id}`
  );
  return {
    ...baseTags,
    openGraph: {
      ...baseTags.openGraph,
      ...getOrganizationOpenGraphTags(project.organization),
    },
    robots: { follow: true, index: project.published },
  };
}

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const MyHomeLayout: FC<Props> = async ({ children, params }) => {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    const project = await apiClient.get<ZetkinProject>(
      `/api/orgs/${params.orgId}/campaigns/${params.projId}`
    );

    return (
      <HomeThemeProvider>
        <PublicProjectLayout project={project}>{children}</PublicProjectLayout>
      </HomeThemeProvider>
    );
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 404) {
      notFound();
    }
    throw e;
  }
};

export default MyHomeLayout;
