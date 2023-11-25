import { Box } from '@mui/material';
import { FC } from 'react';
import messageIds from 'features/surveys/l10n/messageIds';
import { Msg } from 'core/i18n';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';

export type SurveySuccessProps = {
  survey: ZetkinSurveyExtended;
};

const SurveySuccess: FC<SurveySuccessProps> = ({ survey }) => {
  return (
    <Box>
      <h1>
        <Msg id={messageIds.surveyFormSubmitted.title} />
      </h1>
      <p>
        <Msg
          id={messageIds.surveyFormSubmitted.text}
          values={{ title: survey.title }}
        />
      </p>
    </Box>
  );
};

export default SurveySuccess;
