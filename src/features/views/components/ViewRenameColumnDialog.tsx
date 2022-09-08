import { useIntl } from 'react-intl';
import { FunctionComponent, useState } from 'react';

import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import { TextField } from '@material-ui/core';
import ZetkinDialog from 'components/ZetkinDialog';
import { ZetkinViewColumn } from 'features/views/components/types';

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
    <ZetkinDialog onClose={onCancel} open={true}>
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
        <SubmitCancelButtons
          onCancel={onCancel}
          submitText={intl.formatMessage({
            id: 'misc.views.columnRenameDialog.save',
          })}
        />
      </form>
    </ZetkinDialog>
  );
};

export default ViewRenameColumnDialog;
