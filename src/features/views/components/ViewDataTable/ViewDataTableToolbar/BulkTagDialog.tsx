import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { FC, useContext, useState } from 'react';

import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/views/l10n/messageIds';
import TagManager from 'features/tags/components/TagManager';
import { ZetkinAppliedTag } from 'utils/types/zetkin';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';

type Props = {
  numPeople: number;
  onBulkTag: (tags: ZetkinAppliedTag[]) => Promise<void>;
  onClose: () => void;
  open: boolean;
};

const BulkTagDialog: FC<Props> = ({ numPeople, onBulkTag, onClose, open }) => {
  const messages = useMessages(messageIds);
  const { showSnackbar } = useContext(ZUISnackbarContext);

  const [isLoading, setIsLoading] = useState(false);
  const [errorTagging, setErrorTagging] = useState(false);
  const [selectedTags, setSelectedTags] = useState<ZetkinAppliedTag[]>([]);

  const close = () => {
    onClose();
    setErrorTagging(false);
    setSelectedTags([]);
  };

  return (
    <Dialog fullWidth onClose={() => close()} open={open}>
      <DialogTitle>
        <Msg id={messageIds.bulkTagDialog.title} values={{ numPeople }} />
      </DialogTitle>
      <DialogContent>
        <TagManager
          assignedTags={selectedTags}
          groupTags
          onAssignTag={(tag) => {
            const newAssignedTags = selectedTags.concat([
              tag,
            ] as ZetkinAppliedTag[]);
            setSelectedTags(newAssignedTags);
          }}
          onUnassignTag={(tag) => {
            const unassignedTags = selectedTags.filter((t) => t.id != tag.id);
            setSelectedTags(unassignedTags);
          }}
        />
      </DialogContent>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}
      >
        {errorTagging && (
          <Alert severity="error">
            <Msg id={messageIds.bulkTagDialog.errorMessage} />
          </Alert>
        )}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={() => close()}>
            <Msg id={messageIds.bulkTagDialog.cancelButton} />
          </Button>
          <Button
            disabled={selectedTags.length === 0}
            loading={isLoading}
            onClick={async () => {
              try {
                setErrorTagging(false);
                setIsLoading(true);
                await onBulkTag(selectedTags);
                close();
                showSnackbar(
                  'success',
                  messages.bulkTagDialog.successMessage({
                    numPeople,
                    numTags: selectedTags.length,
                  })
                );
              } catch {
                setErrorTagging(true);
              } finally {
                setIsLoading(false);
              }
            }}
            variant="contained"
          >
            <Msg
              id={messageIds.bulkTagDialog.submitButton}
              values={{ numPeople, numTags: selectedTags.length }}
            />
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default BulkTagDialog;
