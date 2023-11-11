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
  const surveys = useSurvey(parseInt(orgId), parseInt(surveyId));
  return (
    <h1>
      Page for org {orgId}, survey {surveyId}
    </h1>
  );
};

export default Page;
