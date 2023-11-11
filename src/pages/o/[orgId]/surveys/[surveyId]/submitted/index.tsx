import { FC } from 'react';
import { scaffold } from 'utils/next';
import useSurvey from 'features/surveys/hooks/useSurvey';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async (ctx) => {
  const { surveyId, orgId } = ctx.params!;
  return {
    props: {
      orgId,
      surveyId,
    },
  };
}, scaffoldOptions);

type PageProps = {
  orgId: string;
  surveyId: string;
};

const Page: FC<PageProps> = ({ orgId, surveyId }) => {
  const survey = useSurvey(parseInt(orgId, 10), parseInt(surveyId, 10));
  return (
    <>
      <h1>Survey Submitted</h1>
      <p>
        Your responses to &quot;{survey.data?.title}&quot; have been submitted.
      </p>
    </>
  );
};

export default Page;
