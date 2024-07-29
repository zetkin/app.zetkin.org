/* eslint-disable jsx-a11y/no-autofocus */
import { Box, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import ColorPicker from './ColorPicker';
import messageIds from '../../../../l10n/messageIds';
import TagGroupSelect from './TagGroupSelect';
import TypeSelect from './TypeSelect';
import ZUIDialog from 'zui/ZUIDialog';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';
import { EditTag, NewTag, NewTagGroup } from '../../types';
import { Msg, useMessages } from 'core/i18n';
import { ZetkinTag, ZetkinTagGroup } from 'utils/types/zetkin';

interface TagDialogProps {
  groups: ZetkinTagGroup[];
  open: boolean;
  onClose: () => void;
  onDelete?: (tagId: number) => void;
  onSubmit: (tag: NewTag | EditTag) => void;
  submitLabel?: string;
  tag?: ZetkinTag | Pick<ZetkinTag, 'title'>;
}

const TagDialog: React.FunctionComponent<TagDialogProps> = ({
  groups,
  open,
  onClose,
  onDelete,
  onSubmit,
  tag,
}) => {
  const messages = useMessages(messageIds);
  const [title, setTitle] = useState('');
  const [titleEdited, setTitleEdited] = useState(false);
  const [color, setColor] = useState<{ valid: boolean; value: string }>({
    valid: true,
    value: '',
  });
  const [group, setGroup] = useState<
    ZetkinTagGroup | NewTagGroup | null | undefined
  >();
  const [type, setType] = useState<ZetkinTag['value_type']>(null);
  const editingTag = tag && 'id' in tag;
  const isTagPage = window.location.pathname.includes('tags');

  const submitLabel = () => {
    if (isTagPage) {
      return editingTag
        ? messages.dialog.editTagButton()
        : messages.dialog.createTagButton();
    } else {
      return editingTag
        ? messages.dialog.editTagButton()
        : messages.dialog.createAndApplyButton();
    }
  };

  useEffect(() => {
    setTitle(tag?.title || '');
    setColor(
      tag && 'color' in tag && tag.color
        ? { valid: true, value: tag.color.slice(1) }
        : { valid: true, value: '' }
    );
    setGroup(tag && 'group' in tag ? tag.group : undefined);
    setType(tag && 'value_type' in tag ? tag.value_type : null);
  }, [tag]);

  const closeAndClear = () => {
    setTitle('');
    setColor({ valid: true, value: '' });
    setGroup(undefined);
    setTitleEdited(false);
    setType(null);
    onClose();
  };

  const showDeleteButton = tag && 'id' in tag && onDelete;

  return (
    <ZUIDialog
      onClose={closeAndClear}
      open={open}
      title={
        editingTag ? messages.dialog.editTitle() : messages.dialog.createTitle()
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const tagBody = {
            ...(color.value && { color: `#${color.value}` }),
            ...(tag && 'id' in tag && { id: tag.id }),
            ...(type && { value_type: type }),
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
          helperText={titleEdited && !title && messages.dialog.titleErrorText()}
          inputProps={{ 'data-testid': 'TagManager-TagDialog-titleField' }}
          label={messages.dialog.titleLabel()}
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
        <TypeSelect
          disabled={tag && 'id' in tag}
          onChange={(value) => setType(value)}
          value={type}
        />
        <Box
          alignItems="flex-end"
          display="flex"
          justifyContent="space-between"
        >
          {showDeleteButton && (
            <Button
              onClick={() => {
                onDelete(tag.id);
                closeAndClear();
              }}
              sx={{ margin: 1 }}
            >
              <Msg id={messageIds.dialog.deleteButtonLabel} />
            </Button>
          )}
          <ZUISubmitCancelButtons
            onCancel={closeAndClear}
            submitDisabled={!title || !color.valid}
            submitText={submitLabel()}
          />
        </Box>
      </form>
    </ZUIDialog>
  );
};

export default TagDialog;
