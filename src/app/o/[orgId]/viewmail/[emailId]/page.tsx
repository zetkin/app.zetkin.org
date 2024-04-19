import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { getBrowserLanguage } from 'utils/locale';
import getServerMessages from 'core/i18n/server';
import messageIds from 'features/emails/l10n/messageIds';
import PublicEmailPage from 'features/emails/pages/PublicEmailPage';
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

  const lang = getBrowserLanguage(headers().get('accept-language') || '');
  const messages = await getServerMessages(lang, messageIds);

  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  try {
    const email = await apiClient.get<ZetkinEmail>(
      `/api/orgs/${orgId}/emails/${emailId}`
    );

    const emailHtml = renderEmailHtml(email, {
      'target.first_name': messages.varDefaults.target(),
      'target.full_name': messages.varDefaults.target(),
      'target.last_name': messages.varDefaults.target(),
    });

    return <PublicEmailPage email={email} emailHtml={emailHtml} />;
  } catch (err) {
    return notFound();
  }
}
