import Fuse from 'fuse.js';
import { lighten } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { Autocomplete, TextField } from '@mui/material';

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
    width: '300px',
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

  return (
    <Autocomplete
      classes={{
        root: classes.inputRoot,
      }}
      disablePortal
      filterOptions={(options, { inputValue }) => {
        const searchedResults = fuse.search(inputValue);
        const output: string[] = [];
        searchedResults.map((result) => output.push(result.item));
        return inputValue ? output : options;
      }}
      id="type-autocomplete"
      options={types}
      renderInput={(params) => (
        // <FormControl variant="standard">
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
            disableUnderline: true,
          }}
          inputRef={inputRef}
          label={currentType}
        />
        // </FormControl>
      )}
    />
  );
};
export default ZUIAutocompleteInPlace;
