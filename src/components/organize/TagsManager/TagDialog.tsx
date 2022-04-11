import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import { TextField } from '@material-ui/core';
import { useState } from 'react';

import ZetkinDialog from 'components/ZetkinDialog';
import { ZetkinTag } from 'types/zetkin';

interface TagDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (tag: Partial<ZetkinTag>) => void;
}

const TagDialog: React.FunctionComponent<TagDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');

  const submitForm = () => {
    onSubmit({ title });
  };

  return (
    <ZetkinDialog onClose={onClose} open={open} title="Create Tag">
      <form onSubmit={() => submitForm()}>
        <TextField
          label="Name"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <SubmitCancelButtons onCancel={onClose} />
      </form>
    </ZetkinDialog>
  );
};

export default TagDialog;
