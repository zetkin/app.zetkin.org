import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import { TextField } from '@material-ui/core';
import { FormEvent, useState } from 'react';

import ZetkinDialog from 'components/ZetkinDialog';
import { ZetkinTag } from 'types/zetkin';

interface TagDialogProps {
  open: boolean;
  onClose: () => void;
  tag?: ZetkinTag;
}

const TagDialog: React.FunctionComponent<TagDialogProps> = ({
  open,
  onClose,
  tag,
}) => {
  const [title, setTitle] = useState('');

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    return { e, tag };
  };

  return (
    <ZetkinDialog onClose={onClose} open={open} title="Create Tag">
      <form onSubmit={(e) => submitForm(e)}>
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
