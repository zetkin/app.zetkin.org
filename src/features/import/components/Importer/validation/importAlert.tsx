import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';

import { Circle } from '@mui/icons-material';
import messageIds from 'features/import/l10n/messageIds';
import { useMessages } from 'core/i18n';

export enum ALERT_STATUS {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}
interface ImportAlertProps {
  bullets?: string[];
  msg: string;
  status: ALERT_STATUS;
  title: string;
  onClickBack?: () => void;
  onClickCheckbox?: () => void;
}
const ImportAlert: React.FunctionComponent<ImportAlertProps> = ({
  bullets,
  msg,
  status,
  title,
  onClickBack,
  onClickCheckbox,
}) => {
  const message = useMessages(messageIds);
  return (
    <Alert
      action={
        onClickBack && (
          <Button color="inherit" sx={{ fontWeight: 'bold' }} variant="text">
            {message.validation.alerts.back()}
          </Button>
        )
      }
      severity={status}
    >
      <AlertTitle>
        <strong>{title}</strong>
      </AlertTitle>
      <>
        {msg}
        {onClickCheckbox && (
          <Box sx={{ ml: 1.5, mt: 1.5 }}>
            <FormControlLabel
              control={<Checkbox onClick={onClickCheckbox} />}
              label={message.validation.alerts.checkbox()}
            />
          </Box>
        )}
        {bullets && (
          <Box mt={2}>
            {bullets.map((item, index) => (
              <Box
                key={`bulletOpt-${index}`}
                alignItems="center"
                display="flex"
              >
                <Circle sx={{ fontSize: '5px', ml: 1, mr: 0.8 }} />
                <Typography>{item}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </>
    </Alert>
  );
};
export default ImportAlert;
