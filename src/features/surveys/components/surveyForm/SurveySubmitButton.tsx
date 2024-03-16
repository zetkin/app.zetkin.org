import { FC } from 'react';
import messageIds from 'features/surveys/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { Box, Button } from '@mui/material';

const SurveySubmitButton: FC = () => {
  const messages = useMessages(messageIds);

  return (
    <Box bgcolor="background.default" padding={2}>
      <Button
        color="primary"
        data-testid="Survey-submit"
        style={{ textAlign: 'center', width: '100%' }}
        type="submit"
        variant="contained"
      >
        {messages.surveyForm.submit()}
      </Button>
    </Box>
  );
};

export default SurveySubmitButton;
