import useDebounce from 'utils/hooks/useDebounce';
import { Clear, FilterList } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

interface EventInputFilterProps {
  onDebounce: (value: string) => void;
  placeholder: string;
  userText: string;
  reset: boolean;
}
const EventInputFilter = ({
  onDebounce,
  placeholder,
  userText,
  reset,
}: EventInputFilterProps) => {
  const [userInput, setUserInput] = useState<string>(userText);

  useEffect(() => {
    if (reset === true) {
      setUserInput('');
    }
  }, [userText]);

  const debouncedFinishedTyping = useDebounce(async (value: string) => {
    onDebounce(value);
  }, 400);

  return (
    <TextField
      fullWidth
      InputProps={{
        endAdornment: (
          <>
            {userInput && (
              <IconButton
                onClick={() => {
                  setUserInput('');
                  onDebounce('');
                }}
              >
                <Clear />
              </IconButton>
            )}
          </>
        ),
        startAdornment: (
          <InputAdornment position="start">
            <FilterList />
          </InputAdornment>
        ),
      }}
      onChange={(e) => {
        setUserInput(e.target.value);
        debouncedFinishedTyping(e.target.value);
      }}
      placeholder={placeholder}
      value={userInput}
    />
  );
};

export default EventInputFilter;
