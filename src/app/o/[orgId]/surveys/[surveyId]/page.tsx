'use client';

import { Container } from '@mui/material';
import { FC } from 'react';
import SurveyForm from 'features/surveys/components/surveyForm/SurveyForm';
import SurveyHeading from 'features/surveys/components/surveyForm/SurveyHeading';
import useSurvey from 'features/surveys/hooks/useSurvey';
import {
  ZetkinSurveyExtended,
  ZetkinSurveyFormStatus,
} from 'utils/types/zetkin';

type PageProps = {
  // formData: NodeJS.Dict<string | string[]>;
  // status: ZetkinSurveyFormStatus;
  // survey: ZetkinSurveyExtended;
  params: {
    orgId: string;
    surveyId: string;
  };
};

const Page: FC<PageProps> = ({ params }) => {
  const { data: survey } = useSurvey(
    parseInt(params.orgId, 10),
    parseInt(params.surveyId, 10)
  );
  const status: ZetkinSurveyFormStatus = 'editing';

  if (!survey) {
    return null;
  }

  return (
    <Container style={{ height: '100vh' }}>
      <SurveyHeading status={status} survey={survey as ZetkinSurveyExtended} />
      <SurveyForm formData={{}} survey={survey as ZetkinSurveyExtended} />
    </Container>
  );
};

export default Page;
