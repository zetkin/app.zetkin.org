/* eslint-disable react/display-name */
import { ChangeEventHandler, forwardRef } from 'react';

import Search from '@material-ui/icons/Search';
import { useIntl } from 'react-intl';
import { InputAdornment, TextField } from '@material-ui/core';

interface SearchFieldProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ onChange }) => {
    const intl = useIntl();

    return (
      <TextField
        aria-label={intl.formatMessage({
          id: 'layout.organize.search.label',
        })}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        onChange={onChange}
        placeholder={intl.formatMessage({
          id: 'layout.organize.search.placeholder',
        })}
        variant="outlined"
      />
    );
  }
);

export default SearchField;
