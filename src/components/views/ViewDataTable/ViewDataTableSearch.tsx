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
import { ReactEventHandler, SyntheticEvent, useState } from 'react';

const useStyles = makeStyles({
  popover: {
    borderRadius: 0,
    minWidth: 450,
    padding: 24,
  },
});

interface ViewDataTableSearchProps {
  minSearchLength?: number;
}

const ViewDataTableSearch: React.FunctionComponent<
  ViewDataTableSearchProps
> = ({ minSearchLength = 3 }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const classes = useStyles();
  const open = Boolean(anchorEl);
  const [searchString, setSearchString] = useState<string>('');
  const id = open ? 'sort-options' : undefined;
  const active = searchString.length >= minSearchLength;

  const handleSearchButtonClick = (
    event: React.SyntheticEvent<HTMLButtonElement>
  ) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (evt: SyntheticEvent<HTMLInputElement>) => {
    setSearchString(evt.currentTarget.value);
  };
  const handleClear = () => {
    setSearchString('');
    setAnchorEl(null);
  };

  return (
    <>
      <Badge
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        color="primary"
        invisible={!active}
        overlap="circular"
        variant="dot"
      >
        <Button
          data-testid="ViewDataTableToolbar-showSearch"
          onClick={handleSearchButtonClick}
          startIcon={<Search />}
        >
          <FormattedMessage id="misc.views.viewTableSearch.button" />
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
      >
        <Box display="flex" flexDirection="column">
          <TextField
            InputProps={{
              endAdornment: (
                <Fade in={active}>
                  <IconButton onClick={handleClear}>
                    <Close />
                  </IconButton>
                </Fade>
              ),
            }}
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

export default ViewDataTableSearch;
