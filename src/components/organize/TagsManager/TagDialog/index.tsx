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
  groups: ZetkinTagGroup[];
  open: boolean;
  onClose: () => void;
  onSubmit: OnCreateTagHandler;
  tag?: Partial<ZetkinTag>;
}

const TagDialog: React.FunctionComponent<TagDialogProps> = ({
  groups,
  open,
  onClose,
  onSubmit,
  tag,
}) => {
  const [title, setTitle] = useState('');
  const [group, setGroup] = useState<
    ZetkinTagGroup | { title: string } | null | undefined
  >();
  const [color, setColor] = useState('');

  useEffect(() => {
    if (tag) {
      setTitle(tag.title || '');
      setGroup(tag.group || undefined);
      setColor(tag.color || '');
    }
  }, [tag]);

  return (
    <ZetkinDialog onClose={onClose} open={open} title="Create Tag">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (group && 'id' in group) {
            // If existing group, submit with POST body
            onSubmit({
              color: color || undefined,
              group_id: group.id,
              title,
            });
          } else if (group && !('id' in group)) {
            // If new group, submit with group object
            onSubmit({
              color: color || undefined,
              group,
              title,
            });
          } else {
            // If no group
            onSubmit({
              color: color || undefined,
              title,
            });
          }
          onClose();
        }}
      >
        <TextField
          defaultValue={title}
          fullWidth
          id="TagManager-TagDialog-titleField"
          label="Tag name"
          margin="normal"
          onChange={(e) => setTitle(e.target.value)}
          onClick={(e) => (e.target as HTMLInputElement).focus()}
          variant="outlined"
        />
        <TagGroupSelect
          groups={groups}
          onChange={(e, value) => setGroup(value)}
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
