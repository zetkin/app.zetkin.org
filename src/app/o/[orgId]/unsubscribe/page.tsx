import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import UnsubscribePage from 'features/emails/pages/UnsubscribePage';
import { ZetkinOrganization } from 'utils/types/zetkin';

type PageProps = {
  params: {
    orgId: string;
  };
  searchParams: {
    unsub?: string;
  };
};

export default async function Page({ params, searchParams }: PageProps) {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const unsubUrl = searchParams.unsub;
  if (!unsubUrl) {
    return notFound();
  }

  try {
    const org = await apiClient.get<ZetkinOrganization>(
      `/api/orgs/${params.orgId}`
    );

    return <UnsubscribePage org={org} unsubUrl={unsubUrl} />;
  } catch (err) {
    return notFound();
  }
}
