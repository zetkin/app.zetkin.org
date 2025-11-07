'use server';

import { headers } from 'next/headers';
import { Metadata } from 'next';
import { FC, ReactElement, ReactNode } from 'react';
import { notFound } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import PublicSurveyLayout from 'features/surveys/layouts/PublicSurveyLayout';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import { ApiClientError } from 'core/api/errors';
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

  return getSeoTags(
    `${survey.title} | ${survey.organization.title}`,
    survey.info_text,
    `/o/${survey.organization.id}/surveys/${survey.id}`
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

  return (
    <HomeThemeProvider>
      <PublicSurveyLayout survey={survey}>{children}</PublicSurveyLayout>
    </HomeThemeProvider>
  );
};

export default SurveyLayout;
