'use client';

import { Container } from '@mui/material';
import { FC } from 'react';
import SurveySuccess from 'features/surveys/components/surveyForm/SurveySuccess';
import useSurvey from 'features/surveys/hooks/useSurvey';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';

type PageProps = {
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

  if (!survey) {
    return null;
  }

  return (
    <Container style={{ height: '100vh' }}>
      <SurveySuccess survey={survey as ZetkinSurveyExtended} />
    </Container>
  );
};

export default Page;
