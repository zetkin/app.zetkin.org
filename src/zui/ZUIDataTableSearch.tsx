import { makeStyles } from '@mui/styles';
import {
  Badge,
  Box,
  Button,
  Fade,
  IconButton,
  Popover,
  TextField,
} from '@mui/material';
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
import { Msg, useMessages } from 'core/i18n';

export const ID_SEARCH_CHAR = '#';

const useStyles = makeStyles({
  popover: {
    borderRadius: 0,
    minWidth: 450,
    padding: 24,
  },
});

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
  const classes = useStyles();
  const open = Boolean(anchorEl);
  const [searchString, setSearchString] = useState<string>('');
  const id = open ? 'sort-options' : undefined;
  const isIdSearch =
    searchById && searchString[0] === ID_SEARCH_CHAR && searchString.length > 1;
  const isActive = searchString.length >= minSearchLength || isIdSearch;
  const textFieldInputRef = useRef<HTMLInputElement>();
  const [isTyping, setIsTyping] = useState(false);

  const debouncedFinishedTyping = useDebounce(async () => {
    setIsTyping(false);
  }, 400);

  const handleSearchButtonClick = (
    event: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

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
    <>
      <Badge
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        color="primary"
        invisible={!isActive}
        overlap="circular"
        variant="dot"
      >
        <Button
          color="secondary"
          onClick={handleSearchButtonClick}
          startIcon={<Search />}
        >
          <Msg id={messageIds.dataTableSearch.button} />
        </Button>
      </Badge>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        classes={{ paper: classes.popover }}
        elevation={1}
        id={id}
        onClose={handlePopoverClose}
        open={open}
        transformOrigin={{
          horizontal: 'center',
          vertical: 'top',
        }}
        TransitionProps={{ onExited: () => handleClear() }}
      >
        <Box display="flex" flexDirection="column">
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <TextField
            helperText={
              minSearchLength > 1 &&
              searchString.length < 3 &&
              (searchString[0] === ID_SEARCH_CHAR && searchById ? (
                <Msg id={messageIds.dataTableSearch.idSearchHelpText} />
              ) : (
                <Msg
                  id={messageIds.dataTableSearch.helpText}
                  values={{ minSearchLength }}
                />
              ))
            }
            InputProps={{
              endAdornment: (
                <Fade in={isActive}>
                  <IconButton onClick={() => handleClear(true)} size="large">
                    <Close />
                  </IconButton>
                </Fade>
              ),
            }}
            inputRef={textFieldInputRef}
            onChange={handleChange as ReactEventHandler<unknown>}
            placeholder={
              searchById
                ? messages.dataTableSearch.placeholderWithIdSearch()
                : messages.dataTableSearch.placeholder()
            }
            value={searchString}
            variant="outlined"
          />
        </Box>
      </Popover>
    </>
  );
};

export default DataTableSearch;
