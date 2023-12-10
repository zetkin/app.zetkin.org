import BackendApiClient from 'core/api/client/BackendApiClient';
import { FC } from 'react';
import { scaffold } from 'utils/next';
import SurveySuccess from 'features/surveys/components/surveyForm/SurveySuccess';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async (ctx) => {
  const { req } = ctx;
  const { surveyId, orgId } = ctx.params!;

  const apiClient = new BackendApiClient(req.headers);
  let survey: ZetkinSurveyExtended;
  try {
    survey = await apiClient.get<ZetkinSurveyExtended>(
      `/api/orgs/${orgId}/surveys/${surveyId}`
    );
  } catch (e) {
    return { notFound: true };
  }

  return {
    props: {
      survey,
    },
  };
}, scaffoldOptions);

type PageProps = {
  survey: ZetkinSurveyExtended;
};

const Page: FC<PageProps> = ({ survey }) => {
  return <SurveySuccess survey={survey} />;
};

export default Page;
