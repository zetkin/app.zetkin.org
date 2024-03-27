import Box from '@mui/material/Box';
import messageIds from 'features/surveys/l10n/messageIds';
import { Msg } from 'core/i18n';
import SurveyContainer from './SurveyContainer';
import { useTheme } from '@mui/material';
import { FC, useEffect, useRef } from 'react';

const SurveyErrorMessage: FC = () => {
  const element = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  useEffect(() => {
    if (element.current) {
      element.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  return (
    <SurveyContainer ref={element} pt={4} px={2}>
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
