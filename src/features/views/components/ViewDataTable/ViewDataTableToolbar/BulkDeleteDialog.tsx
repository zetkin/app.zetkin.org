import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { FC, useState } from 'react';

import { Msg, useMessages } from 'core/i18n';
import useRootOrganization from 'features/organizations/hooks/useRootOrganization';
import messageIds from 'features/views/l10n/messageIds';

type Props = {
  numPeople: number;
  onBulkDelete: () => void;
  onClose: () => void;
  open: boolean;
  orgId: number;
};

const BulkDeleteDialog: FC<Props> = ({
  numPeople,
  onClose,
  open,
  orgId,
  onBulkDelete,
}) => {
  const messages = useMessages(messageIds);
  const rootOrg = useRootOrganization(orgId).data;
  const [deletionString, setDeletionString] = useState('');
  const hasConfirmedDeletion = deletionString === rootOrg?.title;

  const close = () => {
    onClose();
    setDeletionString('');
  };

  return (
    <Dialog onClose={() => close()} open={open}>
      <DialogTitle>
        <Msg id={messageIds.deleteRowsDialog.title} values={{ numPeople }} />
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Alert severity="warning">
          <Msg id={messageIds.deleteRowsDialog.destructiveAlert} />
        </Alert>
        <DialogContentText>
          <Msg
            id={messageIds.deleteRowsDialog.tagetOrgWarning}
            values={{
              rootOrgTitle: (
                <Box component="strong">{rootOrg?.title ?? ''}</Box>
              ),
            }}
          />
        </DialogContentText>
        <DialogContentText>
          <Msg
            id={messageIds.deleteRowsDialog.instruction}
            values={{
              rootOrgSlug: <Box component="b">{rootOrg?.title ?? ''}</Box>,
            }}
          />
        </DialogContentText>
        <TextField
          label={messages.deleteRowsDialog.confirmationInputLabel()}
          onChange={(evt) => setDeletionString(evt.target.value)}
          size="small"
          value={deletionString}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions sx={{ padding: 2 }}>
        <Button onClick={() => close()}>
          <Msg id={messageIds.deleteRowsDialog.cancelButton} />
        </Button>
        <Button
          color="error"
          disabled={!hasConfirmedDeletion}
          onClick={() => {
            onBulkDelete();
            close();
          }}
          variant="contained"
        >
          <Msg
            id={messageIds.deleteRowsDialog.confirmButton}
            values={{ numPeople }}
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkDeleteDialog;
