'use server';

import { headers } from 'next/headers';
import { Metadata } from 'next';
import { FC, ReactElement, ReactNode } from 'react';
import { notFound } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import HomeThemeProvider from 'features/my/components/HomeThemeProvider';
import PublicSurveyLayout from 'features/public/layouts/PublicSurveyLayout';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import { ApiClientError } from 'core/api/errors';
import { getSeoTags } from 'utils/seoTags';

type Props = {
  children: ReactNode;
  params: Promise<{
    orgId: string;
    surveyId: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
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

const SurveyLayout: FC<Props> = async (
  props
): Promise<ReactElement<unknown>> => {
  const params = await props.params;

  const { children } = props;

  const headersList = await headers();
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
