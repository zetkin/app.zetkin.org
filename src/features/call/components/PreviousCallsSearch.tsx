import { Search } from '@mui/icons-material';
import { FC, useState } from 'react';

import { useMessages } from 'core/i18n';
import useDebounce from 'utils/hooks/useDebounce';
import ZUITextField from 'zui/components/ZUITextField';
import messageIds from '../l10n/messageIds';

type PreviousCallsSearchProps = {
  onDebouncedChange: (value: string) => void;
};

const PreviousCallsSearch: FC<PreviousCallsSearchProps> = ({
  onDebouncedChange,
}) => {
  const messages = useMessages(messageIds);
  const [userInput, setUserInput] = useState<string>('');

  const debouncedSetInput = useDebounce(async (value: string) => {
    onDebouncedChange(value);
  }, 300);

  return (
    <ZUITextField
      fullWidth
      label={messages.callLog.searchLabel()}
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
