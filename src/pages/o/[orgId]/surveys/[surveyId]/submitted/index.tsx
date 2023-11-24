import BackendApiClient from 'core/api/client/BackendApiClient';
import { FC } from 'react';
import messageIds from 'features/surveys/l10n/messageIds';
import { Msg } from 'core/i18n';
import { scaffold } from 'utils/next';
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
  return (
    <>
      <h1>
        <Msg id={messageIds.surveyFormSubmitted.title} />
      </h1>
      <p>
        <Msg
          id={messageIds.surveyFormSubmitted.text}
          values={{ title: survey.title }}
        />
      </p>
    </>
  );
};

export default Page;
