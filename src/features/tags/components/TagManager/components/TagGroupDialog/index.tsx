/* eslint-disable jsx-a11y/no-autofocus */
import { Box, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import messageIds from '../../../../l10n/messageIds';
import ZUIDialog from 'zui/ZUIDialog';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';
import { Msg, useMessages } from 'core/i18n';
import { ZetkinTagGroup } from 'utils/types/zetkin';

interface TagGroupProps {
  group: ZetkinTagGroup | undefined;
  open: boolean;
  onClose: () => void;
  onDelete?: (groupId: number) => void;
  onSubmit: (group: ZetkinTagGroup) => void;
  submitLabel?: string;
}

const TagGroup: React.FunctionComponent<TagGroupProps> = ({
  group,
  open,
  onClose,
  onDelete,
  onSubmit,
  submitLabel,
}) => {
  const messages = useMessages(messageIds);

  const [title, setTitle] = useState('');
  const [titleEdited, setTitleEdited] = useState(false);

  // const editingGroup = group && 'id' in group;

  useEffect(() => {
    setTitle(group?.title || '');
  }, [group]);

  const closeAndClear = () => {
    setTitle('');
    setTitleEdited(false);
    onClose();
  };

  const showDeleteButton = group && 'id' in group && onDelete;

  return (
    <ZUIDialog
      onClose={closeAndClear}
      open={open}
      title={messages.editGroupDialog.editTitle()}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // const tagBody = {
          //   ...(tag && 'id' in tag && { id: tag.id }),
          //   ...(type && { value_type: type }),
          //   title,
          // };
          // if (group && 'id' in group) {
          //   // If selecting existing group, submit with group_id
          //   onSubmit({
          //     group_id: group.id,
          //     ...tagBody,
          //   });
          // } else if (group && !('id' in group)) {
          //   // If selecting new group, submit with group object
          //   onSubmit({
          //     group,
          //     ...tagBody,
          //   });
          // } else {
          //   // If no group
          //   onSubmit({ ...tagBody, group_id: null });
          // }
          if (group) {
            onSubmit(group);
          }
          closeAndClear();
        }}
      >
        <TextField
          error={titleEdited && !title}
          fullWidth
          helperText={titleEdited && !title && messages.dialog.titleErrorText()}
          inputProps={{ 'data-testid': 'TagManager-TagGroup-titleField' }}
          label={messages.editGroupDialog.titleLabel()}
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
        <Box
          alignItems="flex-end"
          display="flex"
          justifyContent="space-between"
        >
          {showDeleteButton && (
            <Button
              onClick={() => {
                onDelete(group.id);
                closeAndClear();
              }}
              sx={{ margin: 1 }}
            >
              <Msg id={messageIds.dialog.deleteButtonLabel} />
            </Button>
          )}
          <ZUISubmitCancelButtons
            onCancel={closeAndClear}
            submitDisabled={!title}
            submitText={submitLabel || messages.dialog.updateTagButton()}
          />
        </Box>
      </form>
    </ZUIDialog>
  );
};

export default TagGroup;
