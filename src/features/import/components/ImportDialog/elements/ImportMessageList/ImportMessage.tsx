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

import messageIds from 'features/import/l10n/messageIds';
import ProblemRowsText from './ProblemRowsText';
import { useMessages } from 'core/i18n';
import useSheets from '../../../../hooks/useSheets';

type Props = {
  description?: string;
  onCheck?: (checked: boolean) => void;
  onClickBack?: () => void;
  rowIndices?: number[];
  status: 'error' | 'info' | 'success' | 'warning';
  title: string;
};

const ImportMessage: FC<Props> = ({
  description,
  onCheck,
  onClickBack,
  rowIndices,
  status,
  title,
}) => {
  const messages = useMessages(messageIds);

  const { firstRowIsHeaders } = useSheets();

  const rowNumbers = rowIndices?.map((rowIndex) =>
    firstRowIsHeaders ? rowIndex + 2 : rowIndex + 1
  );

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
            {messages.preflight.messages.common.back()}
          </Button>
        )
      }
      severity={status}
    >
      <AlertTitle>{title}</AlertTitle>
      <Box display="flex" flexDirection="column">
        {!!description && (
          <Typography mb={1} variant="body2">
            {description}
          </Typography>
        )}
        {!!rowNumbers?.length && (
          <Typography variant="body2">
            <ProblemRowsText rows={rowNumbers} />
          </Typography>
        )}
        {status === 'warning' && (
          <FormControlLabel
            control={
              <Checkbox onChange={(ev) => onCheck?.(ev.target.checked)} />
            }
            label={messages.preflight.messages.common.checkbox()}
            sx={{ marginLeft: 0.5, marginTop: 1 }}
          />
        )}
      </Box>
    </Alert>
  );
};

export default ImportMessage;
