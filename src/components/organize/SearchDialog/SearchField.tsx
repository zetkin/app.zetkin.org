/* eslint-disable react/display-name */
import { ChangeEventHandler, useEffect, useRef } from 'react';

import Search from '@material-ui/icons/Search';
import { useIntl } from 'react-intl';
import { InputAdornment, TextField } from '@material-ui/core';

interface SearchFieldProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const SearchField: React.FunctionComponent<SearchFieldProps> = ({
  onChange,
}) => {
  const intl = useIntl();
  const input = useRef<HTMLInputElement>();

  useEffect(() => {
    // Focus when opening the component
    if (input && input.current) {
      input.current.focus();
    }
  }, [input]);

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
      inputRef={input}
      onChange={onChange}
      placeholder={intl.formatMessage({
        id: 'layout.organize.search.placeholder',
      })}
      variant="outlined"
    />
  );
};

export default SearchField;
