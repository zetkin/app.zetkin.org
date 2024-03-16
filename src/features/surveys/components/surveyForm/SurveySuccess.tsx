'use client';

import { FC } from 'react';
import messageIds from 'features/surveys/l10n/messageIds';
import { Msg } from 'core/i18n';
import SurveyContainer from './SurveyContainer';
import { Typography } from '@mui/material';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';

export type SurveySuccessProps = {
  survey: ZetkinSurveyExtended;
};

const SurveySuccess: FC<SurveySuccessProps> = ({ survey }) => {
  return (
    <SurveyContainer minHeight="60vh" paddingX={2}>
      <Typography component="h2" fontSize="1.5rem" fontWeight="bold">
        <Msg id={messageIds.surveyFormSubmitted.title} />
      </Typography>
      <Typography>
        <Msg
          id={messageIds.surveyFormSubmitted.text}
          values={{ title: survey.title }}
        />
      </Typography>
    </SurveyContainer>
  );
};

export default SurveySuccess;
