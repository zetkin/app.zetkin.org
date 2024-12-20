import { Box, Button, TextField } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import PageBase from './PageBase';
import { ZetkinLocation } from 'features/areaAssignments/types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';

type EditLocationProps = {
  location: ZetkinLocation;
  onBack: () => void;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
};

const EditLocation: FC<EditLocationProps> = ({
  onClose,
  onBack,
  onSave,
  location,
}) => {
  const messages = useMessages(messageIds);

  const [title, setTitle] = useState(location.title || '');
  const [description, setDescription] = useState(location.description || '');

  useEffect(() => {
    setTitle(location.title || '');
    setDescription(location.description || '');
  }, [location]);

  const nothingHasBeenEdited =
    title == location.title &&
    (description == location.description ||
      (!description && !location.description));

  return (
    <PageBase
      actions={
        <Button
          disabled={nothingHasBeenEdited}
          onClick={() => {
            onSave(title, description);
          }}
          variant="contained"
        >
          <Msg id={messageIds.location.edit.saveButtonLabel} />
        </Button>
      }
      onBack={onBack}
      onClose={onClose}
      title={messages.location.edit.header({
        title: location.title || messages.default.location(),
      })}
    >
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          onSave(title, description);
        }}
      >
        <Box display="flex" flexDirection="column" gap={2} height="100%">
          <TextField
            fullWidth
            label={messages.location.edit.titleLabel()}
            onChange={(ev) => setTitle(ev.target.value)}
            value={title}
          />
          <TextField
            fullWidth
            label={messages.location.edit.descriptionLabel()}
            multiline
            onChange={(ev) => setDescription(ev.target.value)}
            rows={5}
            value={description}
          />
        </Box>
      </form>
    </PageBase>
  );
};

export default EditLocation;
