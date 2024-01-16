import { FC } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import ProblemRowsText from './ProblemRowsText';
import { useMessages } from 'core/i18n';

type Props = {
  description?: string;
  onCheck?: (checked: boolean) => void;
  onClickBack?: () => void;
  rows?: number[];
  status: 'error' | 'warning';
  title: string;
};

const ImportMessage: FC<Props> = ({
  description,
  onCheck,
  onClickBack,
  rows,
  status,
  title,
}) => {
  const messages = useMessages(messageIds);

  return (
    <Alert
      action={
        status === 'error' && (
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
      severity={status}
    >
      <AlertTitle>{title}</AlertTitle>
      <Box display="flex" flexDirection="column">
        {description}
        {!!rows?.length && <ProblemRowsText rows={rows} />}
        {status === 'warning' && (
          <FormControlLabel
            control={
              <Checkbox onChange={(ev) => onCheck?.(ev.target.checked)} />
            }
            label={messages.validation.alerts.checkbox()}
            sx={{ marginLeft: 0.5, marginTop: 1 }}
          />
        )}
      </Box>
    </Alert>
  );
};

export default ImportMessage;
