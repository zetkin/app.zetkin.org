import { Search } from '@mui/icons-material';
import { FC, useState } from 'react';

import useDebounce from 'utils/hooks/useDebounce';
import ZUITextField from 'zui/components/ZUITextField';

type PreviousCallsSearchProps = {
  onDebouncedChange: (value: string) => void;
};

const PreviousCallsSearch: FC<PreviousCallsSearchProps> = ({
  onDebouncedChange,
}) => {
  const [userInput, setUserInput] = useState<string>('');

  const debouncedSetInput = useDebounce(async (value: string) => {
    onDebouncedChange(value);
  }, 300);

  return (
    <ZUITextField
      fullWidth
      label="Type to find"
      onChange={(newValue: string) => {
        setUserInput(newValue);
        debouncedSetInput(newValue);
      }}
      startIcon={Search}
      value={userInput}
    />
  );
};

export default PreviousCallsSearch;
