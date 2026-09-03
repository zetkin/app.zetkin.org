import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import UnsubscribePage from 'features/public/pages/UnsubscribePage';
import { ZetkinOrganization } from 'utils/types/zetkin';

type PageProps = {
  params: Promise<{
    orgId: string;
  }>;
  searchParams: Promise<{
    senderEmail?: string;
    senderName?: string;
    unsub?: string;
  }>;
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const unsubUrl = searchParams.unsub;
  const validUnsubUrl = unsubUrl?.startsWith('https://');

  if (!unsubUrl || !validUnsubUrl) {
    return notFound();
  }

  try {
    if (searchParams.senderName && searchParams.senderEmail) {
      return (
        <UnsubscribePage
          senderEmail={searchParams.senderEmail}
          senderName={searchParams.senderName}
          unsubUrl={unsubUrl}
        />
      );
    } else {
      const org = await apiClient.get<ZetkinOrganization>(
        `/api/orgs/${params.orgId}`
      );

      return <UnsubscribePage org={org} unsubUrl={unsubUrl} />;
    }
  } catch (err) {
    return notFound();
  }
}
