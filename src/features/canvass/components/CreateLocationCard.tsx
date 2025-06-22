import { FC, useState } from 'react';
import { Box, Button, FormControl, TextField } from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import IntInput from './LocationDialog/IntInput';
import useDebounce from 'utils/hooks/useDebounce';

type CreateLocationCardProps = {
  onClose: () => void;
  onCreate: (newLocation: {
    numEstimatedHouseholds: number;
    title: string;
  }) => void;
};

export const CreateLocationCard: FC<CreateLocationCardProps> = ({
  onClose,
  onCreate,
}) => {
  const messages = useMessages(messageIds);
  const [title, setTitle] = useState<string>('');
  const [numEstimatedHouseholds, setNumEstimatedHouseholds] =
    useState<number>(1);
  const debouncedSetHouseholds = useDebounce(async (value: number) => {
    setNumEstimatedHouseholds(value);
  }, 100);

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        onCreate({
          numEstimatedHouseholds,
          title: title || messages.default.location(),
        });
        onClose();
      }}
    >
      <FormControl fullWidth sx={{ gap: '1rem' }}>
        <TextField
          fullWidth
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder={messages.map.addLocation.inputPlaceholder()}
          sx={{ paddingTop: 1 }}
        />
        <IntInput
          label={messages.map.addLocation.numHouseholds()}
          min={1}
          onChange={debouncedSetHouseholds}
          value={numEstimatedHouseholds}
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
