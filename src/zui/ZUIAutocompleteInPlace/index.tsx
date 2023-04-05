import Fuse from 'fuse.js';
import { Autocomplete, TextField } from '@mui/material';

interface ZUIAutocompleteInPlaceProps {
  types: string[];
}

const ZUIAutocompleteInPlace = ({ types }: ZUIAutocompleteInPlaceProps) => {
  const fuse = new Fuse(types, { threshold: 0.4 });

  return (
    <Autocomplete
      disablePortal
      filterOptions={(options, { inputValue }) => {
        const searchedResults = fuse.search(inputValue);
        const output: string[] = [];
        searchedResults.map((result) => output.push(result.item));
        return inputValue ? output : options;
      }}
      id="type-autocomplete"
      options={types}
      renderInput={(params) => <TextField {...params} label="types" />}
      sx={{ width: 300 }}
    />
  );
};
export default ZUIAutocompleteInPlace;
