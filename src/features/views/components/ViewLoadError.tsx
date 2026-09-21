import { Alert, Button } from '@mui/material';

import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { useAppDispatch } from 'core/hooks';
import { viewLoadRetry } from '../store';

const ViewLoadError = ({
  orgId,
  viewId,
}: {
  orgId: number;
  viewId: number;
}) => {
  const dispatch = useAppDispatch();

  return (
    <Alert
      action={
        <Button
          color="inherit"
          onClick={() => dispatch(viewLoadRetry([orgId, viewId]))}
        >
          <Msg id={messageIds.loadError.retry} />
        </Button>
      }
      severity="error"
      sx={{ m: 2 }}
    >
      <Msg id={messageIds.loadError.message} />
    </Alert>
  );
};

export default ViewLoadError;
