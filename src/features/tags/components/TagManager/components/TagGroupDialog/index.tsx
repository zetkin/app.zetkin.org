import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';

import messageIds from '../../../../l10n/messageIds';
import ZUIDialog from 'zui/ZUIDialog';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';
import { Msg, useMessages } from 'core/i18n';
import { ZetkinTagGroup } from 'utils/types/zetkin';
import { ZetkinTagGroupPatchBody } from 'features/tags/components/TagManager/types';

interface TagGroupProps {
  group?: ZetkinTagGroup;
  open: boolean;
  onClose: () => void;
  onDelete: (groupId: number) => void;
  onSubmit: (group: ZetkinTagGroupPatchBody) => void;
  submitLabel?: string;
}

const TagGroupDialog: React.FunctionComponent<TagGroupProps> = ({
  group,
  open,
  onClose,
  onDelete,
  onSubmit,
  submitLabel,
}) => {
  const messages = useMessages(messageIds);

  const [title, setTitle] = useState(group?.title ?? '');
  const titleEdited = title != group?.title;

  const closeAndClear = () => {
    setTitle('');
    onClose();
  };

  return (
    <ZUIDialog
      onClose={closeAndClear}
      open={open}
      title={messages.groupDialog.editTitle()}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!group) {
            return;
          }

          const tagGroupBody: ZetkinTagGroupPatchBody = {
            id: group.id,
            title,
          };
          onSubmit(tagGroupBody);
          closeAndClear();
        }}
      >
        <TextField
          error={titleEdited && !title}
          fullWidth
          helperText={titleEdited && !title && messages.dialog.titleErrorText()}
          label={messages.groupDialog.titleLabel()}
          margin="normal"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          onClick={(e) => (e.target as HTMLInputElement).focus()}
          required
          slotProps={{
            htmlInput: {
              'data-testid': 'TagManager-TagGroupDialog-titleField',
            },
          }}
          value={title}
          variant="outlined"
        />
        <Box
          alignItems="flex-end"
          display="flex"
          justifyContent="space-between"
        >
          <Button
            onClick={() => {
              if (!group) {
                return;
              }
              onDelete(group.id);
              closeAndClear();
            }}
            sx={{ margin: 1 }}
          >
            <Msg id={messageIds.dialog.deleteButtonLabel} />
          </Button>
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

export default TagGroupDialog;
