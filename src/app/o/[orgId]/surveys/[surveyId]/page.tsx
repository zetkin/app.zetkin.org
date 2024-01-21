'use server';

import { FC } from 'react';
import { submit } from 'features/surveys/actions/submit';
import SurveyForm from 'features/surveys/components/surveyForm/SurveyForm';

type PageProps = {
  params: {
    orgId: string;
    surveyId: string;
  };
};

const Page: FC<PageProps> = ({ params }) => {
  return (
    <SurveyForm
      action={submit}
      orgId={params.orgId}
      surveyId={params.surveyId}
    />
  );
};

export default Page;
