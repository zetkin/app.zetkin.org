import Box from '@mui/material/Box';
import { FC } from 'react';
import messageIds from 'features/surveys/l10n/messageIds';
import { Msg } from 'core/i18n';

const ErrorMessage: FC = () => {
  return (
    <Box bgcolor="#ee878a" mx={4} my={4} p={2} sx={{ borderRadius: '5px' }}>
      <Msg id={messageIds.surveyForm.error} />
    </Box>
  );
};

export default ErrorMessage;
