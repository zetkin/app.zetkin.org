import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import renderEmailHtml from 'features/emails/utils/rendering/renderEmailHtml';
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

  try {
    const email = await apiClient.get<ZetkinEmail>(
      `/api/orgs/${orgId}/emails/${emailId}`
    );

    const emailHtml = renderEmailHtml(email);

    return (
      <iframe
        srcDoc={emailHtml}
        style={{
          borderWidth: 0,
          height: '100vh',
          width: '100vw',
        }}
        title={email.subject || ''}
      />
    );
  } catch (err) {
    return notFound();
  }
}
