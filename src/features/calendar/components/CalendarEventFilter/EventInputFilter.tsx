import useDebounce from 'utils/hooks/useDebounce';
import { Clear, FilterList } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

interface EventInputFilterProps {
  onChangeFilterText: (value: string) => void;
  placeholder: string;
  userText: string;
  reset: boolean;
}
const EventInputFilter = ({
  onChangeFilterText,
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
    onChangeFilterText(value);
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
                  onChangeFilterText('');
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
