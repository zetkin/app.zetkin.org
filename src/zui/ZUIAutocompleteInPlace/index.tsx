import Fuse from 'fuse.js';
import { lighten } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { Autocomplete, TextField, Tooltip } from '@mui/material';

import { useEffect, useRef, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    '& fieldset': { border: 'none' },
    '&:focus, &:hover': {
      borderColor: lighten(theme.palette.primary.main, 0.65),
      paddingLeft: 10,
      paddingRight: 0,
    },
    border: '2px dotted transparent',
    borderRadius: 10,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 'inherit !important',
    fontWeight: 'inherit',
    maxWidth: '250px',
    overflow: 'hidden',
    paddingRight: 10,
    textOverflow: 'ellipsis',
    transition: 'all 0.2s ease',
    width: '300px', // this cause the problem
  },
  span: {
    // Same styles as input
    '&:focus, &:hover': {
      borderColor: lighten(theme.palette.primary.main, 0.65),
      paddingLeft: 10,
      paddingRight: 0,
    },
    border: '2px dotted transparent',
    borderRadius: 10,
    paddingRight: 10,

    // But invisible and positioned absolutely to not affect flow
    position: 'absolute',
    visibility: 'hidden',
  },
}));

interface ZUIAutocompleteInPlaceProps {
  types: string[];
  currentType: string;
}

const ZUIAutocompleteInPlace = ({
  types,
  currentType,
}: ZUIAutocompleteInPlaceProps) => {
  /* eslint-disable-next-line */
  const [editing, setEditing] = useState<boolean>(false);
  const [eventText, setEventText] = useState<string>(currentType);

  const inputRef = useRef<HTMLInputElement>(null);

  const classes = useStyles();
  const fuse = new Fuse(types, { threshold: 0.4 });

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [editing]);

  const cancelEditing = () => {
    setEditing(false);

    setEventText(currentType);
  };

  const onKeyDown = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter' && !!eventText) {
      // If user has not changed the text, do nothing
      if (eventText === currentType) {
        cancelEditing();
      } else {
        cancelEditing();
      }
    } else if (evt.key === 'Escape') {
      cancelEditing();
    }
  };

  const tooltipText = () => {
    if (eventText) {
      if (editing) {
        return '';
      } else {
        return 'edit';
      }
    }
  };

  return (
    <Tooltip arrow disableHoverListener={editing} title={tooltipText()}>
      {/* <span ref={spanRef} className={classes.span}>
          {eventText || currentType}
        </span> */}
      <Autocomplete
        classes={{
          root: classes.inputRoot,
        }}
        disableClearable
        disablePortal
        filterOptions={(options, { inputValue }) => {
          const searchedResults = fuse.search(inputValue);
          const output: string[] = [];
          searchedResults.map((result) => output.push(result.item));
          return inputValue ? output : options;
        }}
        fullWidth
        id="type-autocomplete"
        onChange={(e, value) => setEventText(value || currentType)}
        onFocus={() => setEditing(true)}
        onKeyDown={onKeyDown}
        options={types}
        readOnly={!editing}
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{
              shrink: false,
              style: {
                maxWidth: 180,
              },
            }}
            InputProps={{
              ...params.InputProps,
            }}
            inputRef={inputRef}
          />
        )}
        value={eventText}
      />
    </Tooltip>
  );
};
export default ZUIAutocompleteInPlace;
