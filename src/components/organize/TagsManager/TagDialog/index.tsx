/* eslint-disable jsx-a11y/no-autofocus */
import { TextField } from '@material-ui/core';
import { useRouter } from 'next/router';
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
  // This should be request tag
  onSubmit: OnCreateTagHandler;
  tag?: Partial<ZetkinTag>;
}

const TagDialog: React.FunctionComponent<TagDialogProps> = ({
  open,
  onClose,
  onSubmit,
  tag,
}) => {
  const { orgId } = useRouter().query;
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
            color,
            group_id: group?.id,
            organization_id: orgId as string,
            title,
          });
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
        <ColorPicker onChange={(value) => setColor(value)} value={color} />
        <SubmitCancelButtons onCancel={onClose} />
      </form>
    </ZetkinDialog>
  );
};

export default TagDialog;
