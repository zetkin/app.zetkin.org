/* eslint-disable jsx-a11y/no-autofocus */
import { TextField } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';

import ColorPicker from './ColorPicker';
import SubmitCancelButtons from 'components/forms/common/SubmitCancelButtons';
import TagGroupSelect from './TagGroupSelect';
import ZetkinDialog from 'components/ZetkinDialog';
import { EditTag, NewTag, NewTagGroup } from '../types';
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
      title={intl.formatMessage({
        id: 'misc.tags.tagsManager.tagDialog.dialogTitle',
      })}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const tagBody = {
            color: color.value ? `#${color.value}` : undefined,
            id: tag && 'id' in tag ? tag.id : undefined, // Attach id when editing an existing tag
            title,
          };
          if (group && 'id' in group) {
            // If existing group, submit with POST body
            onSubmit({
              group_id: group.id,
              ...tagBody,
            });
          } else if (group && !('id' in group)) {
            // If new group, submit with group object
            onSubmit({
              group,
              ...tagBody,
            });
          } else {
            // If no group
            onSubmit(tagBody);
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
              id: 'misc.tags.tagsManager.tagDialog.titleErrorText',
            })
          }
          inputProps={{ 'data-testid': 'TagManager-TagDialog-titleField' }}
          label={intl.formatMessage({
            id: 'misc.tags.tagsManager.tagDialog.titleLabel',
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
            !tag || !('id' in tag)
              ? intl.formatMessage({
                  id: 'misc.tags.tagsManager.submitCreateTagButton',
                })
              : undefined
          }
        />
      </form>
    </ZetkinDialog>
  );
};

export default TagDialog;
