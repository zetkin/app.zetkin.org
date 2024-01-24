'use client';

import { FC } from 'react';
import messageIds from 'features/surveys/l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';
import { Box, Typography } from '@mui/material';

export type SurveySuccessProps = {
  survey: ZetkinSurveyExtended;
};

const SurveySuccess: FC<SurveySuccessProps> = ({ survey }) => {
  return (
    <Box>
      <Typography variant="h1">
        <Msg id={messageIds.surveyFormSubmitted.title} />
      </Typography>
      <Typography>
        <Msg
          id={messageIds.surveyFormSubmitted.text}
          values={{ title: survey.title }}
        />
      </Typography>
    </Box>
  );
};

export default SurveySuccess;
