'use client';

import { Container } from '@mui/material';
import SurveyForm from 'features/surveys/components/surveyForm/SurveyForm';
import SurveyHeading from 'features/surveys/components/surveyForm/SurveyHeading';
import { useRouter } from 'next/navigation';
import useSurvey from 'features/surveys/hooks/useSurvey';
import { FC, FormEvent, useCallback, useState } from 'react';
import {
  ZetkinSurveyExtended,
  ZetkinSurveyFormStatus,
} from 'utils/types/zetkin';

type PageProps = {
  params: {
    orgId: string;
    surveyId: string;
  };
};

const Page: FC<PageProps> = ({ params }) => {
  const router = useRouter();

  const { data: survey } = useSurvey(
    parseInt(params.orgId, 10),
    parseInt(params.surveyId, 10)
  );

  const [status, setStatus] = useState<ZetkinSurveyFormStatus>('editing');

  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const entries = [...formData.entries()];
    const data = Object.fromEntries(entries);
    try {
      await fetch(
        `/api/orgs/${params.orgId}/surveys/${params.surveyId}/submissions`,
        {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      );
    } catch (e) {
      setStatus('error');
      window.scrollTo(0, 0);
      return;
    }
    router.push(`/o/${params.orgId}/surveys/${params.surveyId}/submitted`);
  }, []);

  if (!survey) {
    return null;
  }

  return (
    <Container style={{ height: '100vh' }}>
      <SurveyHeading status={status} survey={survey as ZetkinSurveyExtended} />
      <SurveyForm onSubmit={onSubmit} survey={survey as ZetkinSurveyExtended} />
    </Container>
  );
};

export default Page;
