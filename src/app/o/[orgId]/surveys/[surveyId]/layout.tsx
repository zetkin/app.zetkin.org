'use server';

import { headers } from 'next/headers';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import PublicSurveyLayout from 'features/surveys/layouts/PublicSurveyLayout';

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

  let survey: ZetkinSurveyExtended | null = null;
  try {
    survey = await apiClient.get<ZetkinSurveyExtended>(
      `/api/orgs/${orgId}/surveys/${surveyId}`
    );
  } catch (error) {
    if (!survey) {
      return {
        description: 'This survey does not exist or you have no access.',
        title: 'Survey not found',
      };
    }
  }

  return {
    description: survey.info_text,
    openGraph: {
      description: survey.info_text,
      title: survey.title,
    },
    title: survey.title,
  };
}

// Async Server Component (no FC typing needed)
const SurveyLayout = async ({
  children,
  params,
}: Props): Promise<ReactNode> => {
  const headersList = headers();
  const headersObject = Object.fromEntries(headersList.entries());
  const apiClient = new BackendApiClient(headersObject);

  const { orgId, surveyId } = params;

  let survey: ZetkinSurveyExtended | null = null;
  try {
    survey = await apiClient.get<ZetkinSurveyExtended>(
      `/api/orgs/${orgId}/surveys/${surveyId}`
    );
  } catch (error) {
    if (!survey) {
      return (
        <HomeThemeProvider>
          <div>Survey not found or access denied.</div>
        </HomeThemeProvider>
      );
    }
  }

  return (
    <HomeThemeProvider>
      <PublicSurveyLayout survey={survey}>{children}</PublicSurveyLayout>
    </HomeThemeProvider>
  );
  return <h1>Hallo</h1>;
};

export default SurveyLayout;
