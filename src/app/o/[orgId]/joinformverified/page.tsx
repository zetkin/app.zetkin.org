import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';
import JoinFormVerifiedPage from 'features/public/components/JoinFormVerifiedPage';

type PageProps = {
  params: Promise<{
    orgId: string;
  }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    const org = await apiClient.get<ZetkinOrganization>(
      `/api/orgs/${params.orgId}`
    );

    return <JoinFormVerifiedPage org={org} />;
  } catch (err) {
    return notFound();
  }
}
