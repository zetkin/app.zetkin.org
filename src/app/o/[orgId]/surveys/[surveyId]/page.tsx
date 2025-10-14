'use server';

import { FC } from 'react';
import { headers } from 'next/headers';

import PublicSurveyPage from 'features/surveys/pages/PublicSurveyPage';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinUser } from 'utils/types/zetkin';
import surveyFetch from 'utils/fetching/surveyFetch';

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
  const survey = await surveyFetch(apiClient, orgId, surveyId);

  let user: ZetkinUser | null;
  try {
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (e) {
    user = null;
  }

  return <PublicSurveyPage survey={survey} user={user} />;
};

export default Page;
