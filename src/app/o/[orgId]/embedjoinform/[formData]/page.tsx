import Iron from '@hapi/iron';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

import EmbeddedJoinForm, {
  Props as JoinFormProps,
} from 'features/joinForms/components/EmbeddedJoinForm';
import { EmbeddedJoinFormData } from 'features/joinForms/types';
import { ZetkinUser } from 'utils/types/zetkin';
import { getBrowserLanguage } from 'utils/locale';
import getServerMessages from 'core/i18n/server';
import globalMessageIds from 'core/i18n/messageIds';
import embeddingMessageIds from 'features/joinForms/l10n/messageIds';
import { PlainMessage } from 'core/i18n/messages';
import { HookedMessageFunc } from 'core/i18n/useMessages';
import BackendApiClient from 'core/api/client/BackendApiClient';

type PageProps = {
  params: {
    formData: string;
    orgId: string;
  };
  searchParams: {
    stylesheet?: string;
  };
};

function resolveMessages<
  MapType extends Record<string, HookedMessageFunc<PlainMessage>>
>(map: MapType): Record<keyof MapType, string> {
  const resolved = {} as Record<keyof MapType, string>;

  for (const mapKey in map) {
    resolved[mapKey] = map[mapKey]();
  }

  return resolved;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { formData } = params;

  try {
    const formDataStr = decodeURIComponent(formData);
    const formDataObj = (await Iron.unseal(
      formDataStr,
      process.env.SESSION_PASSWORD || '',
      Iron.defaults
    )) as EmbeddedJoinFormData;

    const headersList = headers();
    const headersEntries = headersList.entries();
    const headersObject = Object.fromEntries(headersEntries);
    const apiClient = new BackendApiClient(headersObject);

    let user: ZetkinUser | null;
    try {
      user = await apiClient.get<ZetkinUser>('/api/users/me');
    } catch (e) {
      user = null;
    }

    const lang =
      user?.lang || getBrowserLanguage(headers().get('accept-language') || '');
    const [globalMessages, embeddingMessages] = await Promise.all([
      getServerMessages(lang, globalMessageIds),
      getServerMessages(lang, embeddingMessageIds),
    ]);

    const joinFormMessages: JoinFormProps['messages'] = {
      embedding: resolveMessages(embeddingMessages.embedding),
      genderOptions: resolveMessages(globalMessages.genderOptions),
      personFields: resolveMessages(globalMessages.personFields),
    };

    return (
      <div>
        <EmbeddedJoinForm
          encrypted={formDataStr}
          fields={formDataObj.fields}
          messages={joinFormMessages}
        />
        {searchParams.stylesheet && (
          <style>{`@import url(${searchParams.stylesheet})`}</style>
        )}
        {!searchParams.stylesheet && (
          <style>{`
            body {
              padding: 0.5rem;
            }

            .zetkin-joinform__field {
              margin-bottom: 1rem;
            }

            .zetkin-joinform__field input.zetkin-joinform__text-input, .zetkin-joinform__field select {
              width: 100%;
              max-width: 600px;
              padding: 0.3rem;
              font-size: 1.5rem;
            }

            .zetkin-joinform__submit-button {
              border-width: 0;
              font-size: 1.5rem;
              background-color: black;
              color: white;
              padding: 0.5rem 1rem;
              border-radius: 0.2rem;
            }
          `}</style>
        )}
      </div>
    );
  } catch (err) {
    return notFound();
  }
}
