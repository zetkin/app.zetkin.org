import { Alert } from '@mui/material';
import { Button } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { QUERY_STATUS } from 'features/smartSearch/components/types';
import { Msg, PlainMessage } from 'core/i18n';

type Color = 'success' | 'info' | 'warning' | 'info';

const SEVERITY: { [key in QUERY_STATUS]: Color } = {
  [QUERY_STATUS.ASSIGNED]: 'success',
  [QUERY_STATUS.EDITABLE]: 'info',
  [QUERY_STATUS.NEW]: 'warning',
  [QUERY_STATUS.PUBLISHED]: 'info',
};

const ACTION_LABEL: { [key in QUERY_STATUS]: PlainMessage } = {
  [QUERY_STATUS.ASSIGNED]: messageIds.assignees.links.readOnly,
  [QUERY_STATUS.EDITABLE]: messageIds.assignees.links.edit,
  [QUERY_STATUS.NEW]: messageIds.assignees.links.create,
  [QUERY_STATUS.PUBLISHED]: messageIds.assignees.links.readOnly,
};

const QueryStatusAlert: React.FunctionComponent<{
  openDialog: () => void;
  status: QUERY_STATUS;
}> = ({ status, openDialog }) => {
  return (
    <Alert
      action={
        <Button
          color="inherit"
          data-testid="QueryStatusAlert-actionButton"
          onClick={openDialog}
        >
          <Msg id={ACTION_LABEL[status]} />
        </Button>
      }
      severity={SEVERITY[status]}
      variant="filled"
    >
      <Msg id={messageIds.assignees.queryStates[status]} />
    </Alert>
  );
};

export default QueryStatusAlert;
