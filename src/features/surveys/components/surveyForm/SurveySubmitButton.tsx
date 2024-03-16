import { Button } from '@mui/material';
import { FC } from 'react';
import messageIds from 'features/surveys/l10n/messageIds';
import SurveyContainer from './SurveyContainer';
import { useMessages } from 'core/i18n';

const SurveySubmitButton: FC = () => {
  const messages = useMessages(messageIds);

  return (
    <SurveyContainer bgcolor="background.default" paddingX={2} paddingY={4}>
      <Button
        color="primary"
        data-testid="Survey-submit"
        style={{ textAlign: 'center', width: '100%' }}
        type="submit"
        variant="contained"
      >
        {messages.surveyForm.submit()}
      </Button>
    </SurveyContainer>
  );
};

export default SurveySubmitButton;
