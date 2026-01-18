import { Fade, IconButton, TextField } from '@mui/material';
import { Close, Search } from '@mui/icons-material';
import {
  ReactEventHandler,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import messageIds from './l10n/messageIds';
import useDebounce from 'utils/hooks/useDebounce';
import { useMessages } from 'core/i18n';

export const ID_SEARCH_CHAR = '#';

interface ZUIDataTableSearchProps {
  minSearchLength?: number;
  onChange: (searchString: string) => void;
  searchById?: boolean;
}

const DataTableSearch: React.FunctionComponent<ZUIDataTableSearchProps> = ({
  minSearchLength = 3,
  onChange,
  searchById = false,
}) => {
  const messages = useMessages(messageIds);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const [searchString, setSearchString] = useState<string>('');
  const isIdSearch =
    searchById && searchString[0] === ID_SEARCH_CHAR && searchString.length > 1;
  const isActive = searchString.length >= minSearchLength || isIdSearch;
  const textFieldInputRef = useRef<HTMLInputElement>();
  const [isTyping, setIsTyping] = useState(false);

  const debouncedFinishedTyping = useDebounce(async () => {
    setIsTyping(false);
  }, 400);

  const handleChange = (evt: SyntheticEvent<HTMLInputElement>) => {
    setSearchString(evt.currentTarget.value);
    setIsTyping(true);
    debouncedFinishedTyping();
  };

  const handleClear = (override?: boolean) => {
    if (!isActive || override) {
      setSearchString('');
    }
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!isTyping) {
      onChange(isActive ? searchString : '');
    }
  }, [searchString, isTyping]);

  useEffect(() => {
    if (open) {
      setTimeout(() => textFieldInputRef.current?.focus(), 50);
    }
  }, [open]);

  return (
    <TextField
      inputRef={textFieldInputRef}
      onChange={handleChange as ReactEventHandler<unknown>}
      placeholder={
        searchById
          ? messages.dataTableSearch.placeholderWithIdSearch({
              minSearchLength,
            })
          : messages.dataTableSearch.placeholder({ minSearchLength })
      }
      size="small"
      slotProps={{
        input: {
          endAdornment: (
            <Fade in={isActive}>
              <IconButton onClick={() => handleClear(true)}>
                <Close />
              </IconButton>
            </Fade>
          ),
          startAdornment: <Search color="secondary" sx={{ mr: 1 }} />,
        },
      }}
      sx={{ maxWidth: '400px', width: '33%' }}
      value={searchString}
      variant="outlined"
    />
  );
};

export default DataTableSearch;
