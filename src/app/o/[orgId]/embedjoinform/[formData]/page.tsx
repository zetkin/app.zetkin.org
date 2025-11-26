import Iron from '@hapi/iron';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

import EmbeddedJoinForm from 'features/joinForms/components/EmbeddedJoinForm';
import { EmbeddedJoinFormData } from 'features/joinForms/types';
import { getNonce } from 'core/utils/getNonce';

type PageProps = {
  params: {
    formData: string;
    orgId: string;
  };
  searchParams: {
    stylesheet?: string;
  };
};

export default async function Page({ params, searchParams }: PageProps) {
  const { formData } = params;

  try {
    const formDataStr = decodeURIComponent(formData);
    const formDataObj = (await Iron.unseal(
      formDataStr,
      process.env.SESSION_PASSWORD || '',
      Iron.defaults
    )) as EmbeddedJoinFormData;

    const nonce = getNonce(Object.fromEntries(headers().entries()));

    return (
      <div>
        <EmbeddedJoinForm encrypted={formDataStr} fields={formDataObj.fields} />
        {searchParams.stylesheet && (
          <style
            nonce={nonce}
          >{`@import url(${searchParams.stylesheet})`}</style>
        )}
        {!searchParams.stylesheet && (
          <style nonce={nonce}>{`
            body {
              padding: 0.5rem;
            }

            .zetkin-joinform__field {
              margin-bottom: 1rem;
            }

            .zetkin-joinform__field input[type="text"], .zetkin-joinform__field select {
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
