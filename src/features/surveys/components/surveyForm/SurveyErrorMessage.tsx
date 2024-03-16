import Box from '@mui/material/Box';
import { FC } from 'react';
import messageIds from 'features/surveys/l10n/messageIds';
import { Msg } from 'core/i18n';
import SurveyContainer from './SurveyContainer';
import { useTheme } from '@mui/material';

const SurveyErrorMessage: FC = () => {
  const theme = useTheme();
  return (
    <SurveyContainer pt={4}>
      <Box
        bgcolor={theme.palette.error.light}
        data-testid="Survey-error"
        p={2}
        role="alert"
        sx={{ borderRadius: '5px' }}
      >
        <Msg id={messageIds.surveyForm.error} />
      </Box>
    </SurveyContainer>
  );
};

export default SurveyErrorMessage;
