import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import UnsubscribedPage from 'features/emails/pages/UnsubscribedPage';
import { ZetkinOrganization } from 'utils/types/zetkin';

type PageProps = {
  params: {
    orgId: string;
  };
  searchParams: {
    sender?: string;
    senderEmail?: string;
    senderName?: string;
  };
};

export default async function Page({ params, searchParams }: PageProps) {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    if (searchParams.senderName && searchParams.senderEmail) {
      return (
        <UnsubscribedPage
          senderEmail={searchParams.senderEmail}
          senderName={searchParams.senderName}
        />
      );
    } else {
      const org = await apiClient.get<ZetkinOrganization>(
        `/api/orgs/${params.orgId}`
      );

      return <UnsubscribedPage org={org} />;
    }
  } catch (err) {
    return notFound();
  }
}
