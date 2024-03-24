import BackendApiClient from 'core/api/client/BackendApiClient';
import { headers } from 'next/headers';
import { ZetkinEmail } from 'utils/types/zetkin';

type PageProps = {
  params: {
    emailId: string;
    orgId: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { emailId, orgId } = params;

  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const email = await apiClient.get<ZetkinEmail>(
    `/api/orgs/${orgId}/emails/${emailId}`
  );

  return <h1>{email.title}</h1>;
}
