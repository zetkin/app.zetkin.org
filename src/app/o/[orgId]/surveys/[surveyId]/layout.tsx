'use server';

import { headers } from 'next/headers';
import { Metadata } from 'next';
import { FC, ReactElement, ReactNode } from 'react';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import PublicSurveyLayout from 'features/surveys/layouts/PublicSurveyLayout';
import { getSeoTags } from 'utils/seoTags';

type Props = {
  children: ReactNode;
  params: {
    orgId: string;
    surveyId: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orgId, surveyId } = params;
  const apiClient = new BackendApiClient({});
  const survey = await apiClient.get<ZetkinSurveyExtended>(
    `/api/orgs/${orgId}/surveys/${surveyId}`
  );

  return getSeoTags(
    `${survey.title} | ${survey.organization.title}`,
    survey.info_text,
    `/o/${survey.organization.id}/surveys/${survey.id}`,
    [
      'social change',
      'feedback',
      'research',
      'community input',
      'surveys',
      'participation',
    ]
  );
}

// @ts-expect-error https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error
const SurveyLayout: FC<Props> = async ({
  children,
  params,
}): Promise<ReactElement> => {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const { orgId, surveyId } = params;
  const survey = await apiClient.get<ZetkinSurveyExtended>(
    `/api/orgs/${orgId}/surveys/${surveyId}`
  );

  return (
    <HomeThemeProvider>
      <PublicSurveyLayout survey={survey}>{children}</PublicSurveyLayout>
    </HomeThemeProvider>
  );
};

export default SurveyLayout;
