import BackendApiClient from 'core/api/client/BackendApiClient';
import { Container } from '@mui/material';
import { FC } from 'react';
import prepareSurveyApiSubmission from 'features/surveys/utils/prepareSurveyApiSubmission';
import SurveyForm from 'features/surveys/components/surveyForm/SurveyForm';
// import { useRouter } from 'next/navigation';
import useSurvey from 'features/surveys/hooks/useSurvey';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';

type PageProps = {
  params: {
    orgId: string;
    surveyId: string;
  };
};

const Page: FC<PageProps> = ({ params }) => {
  // const router = useRouter();

  const { data: survey } = useSurvey(
    parseInt(params.orgId, 10),
    parseInt(params.surveyId, 10)
  );

  const submit = async (formData: FormData): Promise<void> => {
    const submission = prepareSurveyApiSubmission(
      Object.fromEntries([...formData.entries()]),
      false
    );
    const apiClient = new BackendApiClient({});
    await apiClient.post(
      `/api/orgs/${params.orgId}/surveys/${params.surveyId}/submissions`,
      submission
    );
  };

  if (!survey) {
    return null;
  }

  return (
    <Container style={{ height: '100vh' }}>
      <SurveyForm action={submit} survey={survey as ZetkinSurveyExtended} />
    </Container>
  );
};

export default Page;
