/* eslint-disable jsx-a11y/no-autofocus */
import { TextField } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';

import ColorPicker from './ColorPicker';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import TagGroupSelect from './TagGroupSelect';
import ZetkinDialog from 'components/ZetkinDialog';
import { EditTag, NewTag, NewTagGroup } from '../../types';
import { ZetkinTag, ZetkinTagGroup } from 'types/zetkin';

interface TagDialogProps {
  groups: ZetkinTagGroup[];
  open: boolean;
  onClose: () => void;
  onSubmit: (tag: NewTag | EditTag) => void;
  tag?: ZetkinTag | Pick<ZetkinTag, 'title'>;
}

const TagDialog: React.FunctionComponent<TagDialogProps> = ({
  groups,
  open,
  onClose,
  onSubmit,
  tag,
}) => {
  const intl = useIntl();

  const [title, setTitle] = useState('');
  const [titleEdited, setTitleEdited] = useState(false);
  const [color, setColor] = useState<{ valid: boolean; value: string }>({
    valid: true,
    value: '',
  });
  const [group, setGroup] = useState<
    ZetkinTagGroup | NewTagGroup | null | undefined
  >();

  const editingTag = tag && 'id' in tag;

  useEffect(() => {
    setTitle(tag?.title || '');
    setColor(
      tag && 'color' in tag && tag.color
        ? { valid: true, value: tag.color.slice(1) }
        : { valid: true, value: '' }
    );
    setGroup(tag && 'group' in tag ? tag.group : undefined);
  }, [tag]);

  const closeAndClear = () => {
    setTitle('');
    setColor({ valid: true, value: '' });
    setGroup(undefined);
    setTitleEdited(false);
    onClose();
  };

  return (
    <ZetkinDialog
      onClose={closeAndClear}
      open={open}
      title={
        editingTag
          ? 'Edit tag'
          : intl.formatMessage({
              id: 'misc.tags.tagManager.tagDialog.dialogTitle',
            })
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const tagBody = {
            ...(color.value && { color: `#${color.value}` }),
            ...(tag && 'id' in tag && { id: tag.id }),
            title,
          };
          if (group && 'id' in group) {
            // If selecting existing group, submit with group_id
            onSubmit({
              group_id: group.id,
              ...tagBody,
            });
          } else if (group && !('id' in group)) {
            // If selecting new group, submit with group object
            onSubmit({
              group,
              ...tagBody,
            });
          } else {
            // If no group
            onSubmit({ ...tagBody, group_id: null });
          }
          closeAndClear();
        }}
      >
        <TextField
          error={titleEdited && !title}
          fullWidth
          helperText={
            titleEdited &&
            !title &&
            intl.formatMessage({
              id: 'misc.tags.tagManager.tagDialog.titleErrorText',
            })
          }
          inputProps={{ 'data-testid': 'TagManager-TagDialog-titleField' }}
          label={intl.formatMessage({
            id: 'misc.tags.tagManager.tagDialog.titleLabel',
          })}
          margin="normal"
          onChange={(e) => {
            setTitle(e.target.value);
            if (!titleEdited) {
              setTitleEdited(true);
            }
          }}
          onClick={(e) => (e.target as HTMLInputElement).focus()}
          required
          value={title}
          variant="outlined"
        />
        <TagGroupSelect
          groups={groups}
          onChange={(value) => setGroup(value)}
          value={group}
        />
        <ColorPicker
          onChange={(value) => setColor(value)}
          value={color.value}
        />
        <SubmitCancelButtons
          onCancel={closeAndClear}
          submitDisabled={!title || !color.valid}
          submitText={
            editingTag
              ? undefined
              : intl.formatMessage({
                  id: 'misc.tags.tagManager.submitCreateTagButton',
                })
          }
        />
      </form>
    </ZetkinDialog>
  );
};

export default TagDialog;
