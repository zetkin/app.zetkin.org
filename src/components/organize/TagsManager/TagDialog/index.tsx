/* eslint-disable jsx-a11y/no-autofocus */
import { TextField } from '@material-ui/core';
import { useEffect, useState } from 'react';

import ColorPicker from './ColorPicker';
import { OnCreateTagHandler } from '../types';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import TagGroupSelect from './TagGroupSelect';
import ZetkinDialog from 'components/ZetkinDialog';
import { ZetkinTag, ZetkinTagGroup } from 'types/zetkin';

interface TagDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: OnCreateTagHandler;
  tag?: Partial<ZetkinTag>;
}

const TagDialog: React.FunctionComponent<TagDialogProps> = ({
  open,
  onClose,
  onSubmit,
  tag,
}) => {
  const [title, setTitle] = useState(tag?.title || '');
  const [group, setGroup] = useState<ZetkinTagGroup | null | undefined>(
    tag?.group
  );
  const [color, setColor] = useState<string>('');

  useEffect(() => {
    if (tag) {
      setTitle(tag.title || '');
      setGroup(tag.group);
    }
  }, [tag]);

  return (
    <ZetkinDialog onClose={onClose} open={open} title="Create Tag">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            color: color || undefined,
            group_id: group?.id,
            title,
          });
          onClose();
        }}
      >
        <TextField
          defaultValue={title}
          fullWidth
          label="Tag name"
          margin="normal"
          onChange={(e) => setTitle(e.target.value)}
          onClick={(e) => (e.target as HTMLInputElement).focus()}
          variant="outlined"
        />
        <TagGroupSelect
          onChange={(e, value) => setGroup(value)}
          value={group}
        />
        <ColorPicker
          defaultValue={color}
          onChange={(value) => setColor(value)}
        />
        <SubmitCancelButtons onCancel={onClose} />
      </form>
    </ZetkinDialog>
  );
};

export default TagDialog;
