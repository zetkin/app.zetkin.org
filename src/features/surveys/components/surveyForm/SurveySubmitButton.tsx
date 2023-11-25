import { Button } from '@mui/material';
import { FC } from 'react';
import messageIds from 'features/surveys/l10n/messageIds';
import { useMessages } from 'core/i18n';

const SurveySubmitButton: FC = () => {
  const messages = useMessages(messageIds);
  return (
    <Button
      color="primary"
      data-testid="Survey-submit"
      style={{ textAlign: 'center', width: '100%' }}
      type="submit"
      variant="contained"
    >
      {messages.surveyForm.submit()}
    </Button>
  );
};

export default SurveySubmitButton;
