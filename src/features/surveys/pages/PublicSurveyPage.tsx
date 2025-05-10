'use client';

import { FC } from 'react';
import { Box } from '@mui/material';

import ZUISurveyForm from 'zui/components/ZUISurveyForm';
import { submit } from '../actions/submit';
import { ZetkinSurveyExtended, ZetkinUser } from 'utils/types/zetkin';

type PublicSurveyPageProps = {
  survey: ZetkinSurveyExtended;
  user: ZetkinUser | null;
};

const PublicSurveyPage: FC<PublicSurveyPageProps> = ({ survey, user }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ maxWidth: 'sm' }}>
        <ZUISurveyForm onSubmit={submit} survey={survey} user={user} />
      </Box>
    </Box>
  );
};

export default PublicSurveyPage;
