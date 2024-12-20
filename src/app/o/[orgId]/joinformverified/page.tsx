import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinOrganization } from 'utils/types/zetkin';
import JoinFormVerifiedPage from 'features/joinForms/components/JoinFormVerifiedPage';

type PageProps = {
  params: {
    orgId: string;
  };
};

export default async function Page({ params }: PageProps) {
  const headersList = headers();
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
