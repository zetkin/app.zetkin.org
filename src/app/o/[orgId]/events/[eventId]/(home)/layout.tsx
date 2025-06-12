import { FC, PropsWithChildren } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import PublicEventLayout from 'features/organizations/layouts/PublicEventLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';

type Props = PropsWithChildren<{
  params: {
    eventId: number;
    orgId: number;
  };
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const org = await apiClient.get<ZetkinOrganization>(
    `/api/orgs/${params.orgId}`
  );

  return {
    icons: [{ url: '/logo-zetkin.png' }],
    // TODO: use event title when available
    title: org.title,
  };
}

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const EventLayout: FC<Props> = async ({ children, params }) => {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const org = await apiClient.get<ZetkinOrganization>(
    `/api/orgs/${params.orgId}`
  );

  return (
    <HomeThemeProvider>
      <PublicEventLayout eventId={params.eventId} org={org}>
        {children}
      </PublicEventLayout>
    </HomeThemeProvider>
  );
};

export default EventLayout;
