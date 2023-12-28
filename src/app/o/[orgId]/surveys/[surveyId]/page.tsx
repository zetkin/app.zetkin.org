import { Container } from '@mui/material';
import { FC } from 'react';
import SurveyForm from 'features/surveys/components/surveyForm/SurveyForm';
import SurveyHeading from 'features/surveys/components/surveyForm/SurveyHeading';
import {
  ZetkinSurveyExtended,
  ZetkinSurveyFormStatus,
} from 'utils/types/zetkin';

type PageProps = {
  formData: NodeJS.Dict<string | string[]>;
  status: ZetkinSurveyFormStatus;
  survey: ZetkinSurveyExtended;
};

const Page: FC<PageProps> = ({ formData, status, survey }) => {
  return (
    <Container style={{ height: '100vh' }}>
      <SurveyHeading status={status} survey={survey} />
      <SurveyForm formData={formData} survey={survey} />
    </Container>
  );
};

export default Page;
