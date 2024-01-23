'use server';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { submit } from 'features/surveys/actions/submit';
import SurveyForm from 'features/surveys/components/surveyForm/SurveyForm';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import { FC, ReactElement } from 'react';

type PageProps = {
  params: {
    orgId: string;
    surveyId: string;
  };
};

/* @ts-expect-error Server Component */
const Page: FC<PageProps> = async ({ params }): Promise<ReactElement> => {
  const { orgId, surveyId } = params;
  const apiClient = new BackendApiClient({});
  const survey = await apiClient.get<ZetkinSurveyExtended>(
    `/api/orgs/${orgId}/surveys/${surveyId}`
  );

  return <SurveyForm action={submit} survey={survey} />;
};

export default Page;
