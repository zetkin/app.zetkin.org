import { FC, useState } from 'react';
import { Box, Button, FormControl, TextField } from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type CreateLocationCardProps = {
  onClose: () => void;
  onCreate: (title: string) => void;
};

export const CreateLocationCard: FC<CreateLocationCardProps> = ({
  onClose,
  onCreate,
}) => {
  const messages = useMessages(messageIds);
  const [title, setTitle] = useState<string>('');

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        onCreate(title || messages.default.location());
        onClose();
      }}
    >
      <FormControl fullWidth>
        <TextField
          fullWidth
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder={messages.map.addLocation.inputPlaceholder()}
          sx={{ paddingTop: 1 }}
        />
      </FormControl>
      <Box display="flex" gap={1} mt={1}>
        <Box flexBasis={1} flexGrow={1} flexShrink={1}>
          <Button fullWidth onClick={onClose} size="small" variant="outlined">
            <Msg id={messageIds.map.addLocation.cancel} />
          </Button>
        </Box>
        <Box flexBasis={1} flexGrow={1} flexShrink={1}>
          <Button
            disabled={!title}
            fullWidth
            onClick={() => {
              onCreate(title);
              onClose();
            }}
            size="small"
            type="submit"
            variant="contained"
          >
            <Msg id={messageIds.map.addLocation.create} />
          </Button>
        </Box>
      </Box>
    </form>
  );
};
