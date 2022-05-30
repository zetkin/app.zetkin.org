import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/styles';
import {
  Badge,
  Box,
  Button,
  Fade,
  IconButton,
  Popover,
  TextField,
} from '@material-ui/core';
import { Close, Search } from '@material-ui/icons';
import {
  ReactEventHandler,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import useDebounce from 'hooks/useDebounce';

const useStyles = makeStyles({
  popover: {
    borderRadius: 0,
    minWidth: 450,
    padding: 24,
  },
});

interface DataTableSearchProps {
  minSearchLength?: number;
  onChange: (searchString: string) => void;
}

const DataTableSearch: React.FunctionComponent<DataTableSearchProps> = ({
  minSearchLength = 3,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const classes = useStyles();
  const open = Boolean(anchorEl);
  const [searchString, setSearchString] = useState<string>('');
  const id = open ? 'sort-options' : undefined;
  const isActive = searchString.length >= minSearchLength;
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
          data-testid="ViewDataTableToolbar-showSearch"
          onClick={handleSearchButtonClick}
          startIcon={<Search />}
        >
          <FormattedMessage id="misc.dataTable.search.button" />
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
              searchString.length < 3 && (
                <FormattedMessage
                  id="misc.dataTable.search.helpText"
                  values={{ minSearchLength }}
                />
              )
            }
            InputProps={{
              endAdornment: (
                <Fade in={isActive}>
                  <IconButton onClick={() => handleClear(true)}>
                    <Close />
                  </IconButton>
                </Fade>
              ),
            }}
            inputRef={textFieldInputRef}
            onChange={handleChange as ReactEventHandler<unknown>}
            placeholder="Search this view"
            value={searchString}
            variant="outlined"
          />
        </Box>
      </Popover>
    </>
  );
};

export default DataTableSearch;
