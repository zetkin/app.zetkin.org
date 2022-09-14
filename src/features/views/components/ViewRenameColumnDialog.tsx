import { useIntl } from 'react-intl';
import { FunctionComponent, useState } from 'react';

import { TextField } from '@material-ui/core';
import { ZetkinViewColumn } from 'features/views/components/types';
import ZUIDialog from 'zui/ZUIDialog';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';

interface ViewRenameColumnDialogProps {
  column: ZetkinViewColumn;
  onCancel: () => void;
  onSave: (column: ZetkinViewColumn) => void;
}

const ViewRenameColumnDialog: FunctionComponent<
  ViewRenameColumnDialogProps
> = ({ column, onCancel, onSave }) => {
  const intl = useIntl();
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
          label={intl.formatMessage({
            id: 'misc.views.columnRenameDialog.title',
          })}
          onChange={(ev) => setTitle(ev.target.value)}
          value={title}
        />
        <ZUISubmitCancelButtons
          onCancel={onCancel}
          submitText={intl.formatMessage({
            id: 'misc.views.columnRenameDialog.save',
          })}
        />
      </form>
    </ZUIDialog>
  );
};

export default ViewRenameColumnDialog;
