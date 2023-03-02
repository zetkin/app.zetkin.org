import { FunctionComponent, useState } from 'react';

import { TextField } from '@mui/material';
import { useMessages } from 'core/i18n';
import { ZetkinViewColumn } from 'features/views/components/types';
import ZUIDialog from 'zui/ZUIDialog';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';

import messageIds from '../l10n/messageIds';

interface ViewRenameColumnDialogProps {
  column: ZetkinViewColumn;
  onCancel: () => void;
  onSave: (column: ZetkinViewColumn) => void;
}

const ViewRenameColumnDialog: FunctionComponent<
  ViewRenameColumnDialogProps
> = ({ column, onCancel, onSave }) => {
  const messages = useMessages(messageIds);
  const [title, setTitle] = useState(column.title);

  return (
    <ZUIDialog onClose={onCancel} open={true}>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSave({
            ...column,
            title,
          });
        }}
      >
        <TextField
          fullWidth
          id="rename-column-title-field"
          label={messages.columnRenameDialog.title()}
          onChange={(ev) => setTitle(ev.target.value)}
          value={title}
          variant="standard"
        />
        <ZUISubmitCancelButtons
          onCancel={onCancel}
          submitText={messages.columnRenameDialog.save()}
        />
      </form>
    </ZUIDialog>
  );
};

export default ViewRenameColumnDialog;
