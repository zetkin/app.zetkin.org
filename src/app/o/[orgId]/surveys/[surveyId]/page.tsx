'use server';

import { headers } from 'next/headers';
import { Metadata } from 'next';
import { FC, ReactElement } from 'react';

import SurveyForm from 'features/surveys/components/surveyForm/SurveyForm';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinSurveyExtended, ZetkinUser } from 'utils/types/zetkin';

type PageProps = {
  params: {
    orgId: string;
    surveyId: string;
  };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { orgId, surveyId } = params;
  const apiClient = new BackendApiClient({});
  const survey = await apiClient.get<ZetkinSurveyExtended>(
    `/api/orgs/${orgId}/surveys/${surveyId}`
  );
  return {
    description: survey.info_text,
    openGraph: {
      description: survey.info_text,
      title: survey.title,
    },
    title: survey.title,
  };
}

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const Page: FC<PageProps> = async ({ params }): Promise<ReactElement> => {
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

  const { orgId, surveyId } = params;
  const survey = await apiClient.get<ZetkinSurveyExtended>(
    `/api/orgs/${orgId}/surveys/${surveyId}`
  );

  return <SurveyForm survey={survey} user={user} />;
};

export default Page;
