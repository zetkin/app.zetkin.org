'use server';

import { FC } from 'react';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import PublicSurveyPage from 'features/surveys/pages/PublicSurveyPage';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinSurveyExtended, ZetkinUser } from 'utils/types/zetkin';
import { ApiClientError } from 'core/api/errors';

type Props = {
  params: {
    orgId: string;
    surveyId: string;
  };
};

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const Page: FC<Props> = async ({ params }) => {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const { orgId, surveyId } = params;

  let survey: ZetkinSurveyExtended;
  try {
    survey = await apiClient.get<ZetkinSurveyExtended>(
      `/api/orgs/${orgId}/surveys/${surveyId}`
    );
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 404) {
      notFound();
    } else {
      throw e;
    }
  }

  let user: ZetkinUser | null;
  try {
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (e) {
    user = null;
  }

  return <PublicSurveyPage survey={survey} user={user} />;
};

export default Page;
