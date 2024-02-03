import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { IconButton, TextField } from '@mui/material';

import messageIds from '../l10n/messageIds';
import useDebounce from 'utils/hooks/useDebounce';
import { useMessages } from 'core/i18n';

interface EventParticipansFilterProps {
  onFilterChange: (value: string) => void;
}
const EventParticipantsFilter = ({
  onFilterChange,
}: EventParticipansFilterProps) => {
  const [userInput, setUserInput] = useState<string>('');
  const messages = useMessages(messageIds);

  const debouncedFinishedTyping = useDebounce(async (value: string) => {
    onFilterChange(value);
  }, 300);

  return (
    <TextField
      InputProps={{
        endAdornment: userInput ? (
          <IconButton
            onClick={() => {
              setUserInput('');
              onFilterChange('');
            }}
          >
            <ClearIcon />
          </IconButton>
        ) : null,
        startAdornment: <SearchIcon color="secondary" sx={{ mr: 1 }} />,
      }}
      onChange={(e) => {
        setUserInput(e.target.value);
        debouncedFinishedTyping(e.target.value);
      }}
      placeholder={messages.search()}
      size="small"
      sx={{ width: '230px' }}
      value={userInput}
    />
  );
};

export default EventParticipantsFilter;
