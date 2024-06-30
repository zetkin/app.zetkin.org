/* eslint-disable react/display-name */
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
} from 'react';
import Error from '@mui/icons-material/Error';
import Search from '@mui/icons-material/Search';
import {
  CircularProgress,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material';

import messageIds from '../../l10n/messageIds';
import { useMessages } from 'core/i18n';

const SearchFieldIcon: React.FunctionComponent<{
  error: boolean;
  loading: boolean;
}> = ({ loading, error }) => {
  const messages = useMessages(messageIds);

  return (
    <InputAdornment position="start">
      {loading ? (
        <CircularProgress size={24} />
      ) : error ? (
        <Tooltip title={messages.error()}>
          <Error color="error" data-testid="SearchDialog-errorIndicator" />
        </Tooltip>
      ) : (
        // Default
        <Search />
      )}
    </InputAdornment>
  );
};

interface SearchFieldProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  loading: boolean;
  error: boolean;
}

const SearchField: React.FunctionComponent<SearchFieldProps> = ({
  onChange,
  onKeyDown,
  loading,
  error,
}) => {
  const msg = useMessages(messageIds);
  const input = useRef<HTMLInputElement>();

  useEffect(() => {
    // Focus when opening the component
    if (input && input.current) {
      input.current.focus();
    }
  }, [input]);

  return (
    <TextField
      aria-label={msg.label()}
      fullWidth
      id="SearchDialog-inputField"
      InputProps={{
        startAdornment: <SearchFieldIcon error={error} loading={loading} />,
      }}
      inputRef={input}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={msg.placeholder()}
      variant="outlined"
    />
  );
};

export default SearchField;
