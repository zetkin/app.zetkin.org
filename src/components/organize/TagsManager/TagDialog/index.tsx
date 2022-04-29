/* eslint-disable jsx-a11y/no-autofocus */
import { TextField } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { useState } from 'react';

import ColorPicker from './ColorPicker';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import TagGroupSelect from './TagGroupSelect';
import ZetkinDialog from 'components/ZetkinDialog';
import { NewTagGroup, OnCreateTagHandler } from '../types';
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
}) => {
  const intl = useIntl();

  const [title, setTitle] = useState('');
  const [color, setColor] = useState('');
  const [group, setGroup] = useState<
    ZetkinTagGroup | NewTagGroup | null | undefined
  >();

  const closeAndClear = () => {
    setTitle('');
    setColor('');
    setGroup(undefined);
    onClose();
  };

  return (
    <ZetkinDialog
      onClose={closeAndClear}
      open={open}
      title={intl.formatMessage({
        id: 'misc.tags.tagsManager.tagDialog.dialogTitle',
      })}
    >
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
          closeAndClear();
        }}
      >
        <TextField
          fullWidth
          inputProps={{ 'data-testid': 'TagManager-TagDialog-titleField' }}
          label={intl.formatMessage({
            id: 'misc.tags.tagsManager.tagDialog.titleLabel',
          })}
          margin="normal"
          onChange={(e) => setTitle(e.target.value)}
          onClick={(e) => (e.target as HTMLInputElement).focus()}
          value={title}
          variant="outlined"
        />
        <TagGroupSelect
          groups={groups}
          onChange={(value) => setGroup(value)}
          value={group}
        />
        <ColorPicker onChange={(value) => setColor(value)} value={color} />
        <SubmitCancelButtons onCancel={closeAndClear} />
      </form>
    </ZetkinDialog>
  );
};

export default TagDialog;
