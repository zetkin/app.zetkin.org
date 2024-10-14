import Iron from '@hapi/iron';
import { notFound } from 'next/navigation';

import EmbeddedJoinForm from 'features/joinForms/components/EmbeddedJoinForm';
import { EmbeddedJoinFormData } from 'features/joinForms/types';

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

    return (
      <div>
        <EmbeddedJoinForm encrypted={formDataStr} fields={formDataObj.fields} />
        {searchParams.stylesheet && (
          <style>{`@import url(${searchParams.stylesheet})`}</style>
        )}
      </div>
    );
  } catch (err) {
    return notFound();
  }
}
