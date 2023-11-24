import { Circle } from '@mui/icons-material';
import { FC } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';

import { Alert as AlertType } from 'features/import/hooks/useAlerts';
import messageIds from 'features/import/l10n/messageIds';
import { useMessages } from 'core/i18n';

export enum ALERT_STATUS {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

interface ImportAlertProps {
  alert: AlertType;
  bullets?: string[];
  onClickBack?: () => void;
  onCheck?: () => void;
}

const ImportAlert: FC<ImportAlertProps> = ({
  alert,
  bullets,
  onCheck,
  onClickBack,
}) => {
  const messages = useMessages(messageIds);
  return (
    <Alert
      action={
        alert.status === ALERT_STATUS.ERROR && (
          <Button
            color="inherit"
            onClick={onClickBack}
            size="small"
            sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
            variant="text"
          >
            {messages.validation.alerts.back()}
          </Button>
        )
      }
      severity={alert.status}
    >
      <AlertTitle>{alert.title}</AlertTitle>
      <Box display="flex" flexDirection="column">
        {alert.msg}
        {alert.status === ALERT_STATUS.WARNING && (
          <FormControlLabel
            control={<Checkbox onChange={onCheck} />}
            label={messages.validation.alerts.checkbox()}
            sx={{ marginLeft: 0.5, marginTop: 1 }}
          />
        )}
        {bullets && (
          <Box mt={2}>
            {bullets.map((bulletText, index) => (
              <Box
                key={`bulletOpt-${index}`}
                alignItems="center"
                display="flex"
              >
                <Circle sx={{ fontSize: '5px', ml: 1, mr: 0.8 }} />
                <Typography>{bulletText}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Alert>
  );
};

export default ImportAlert;
