/* eslint-disable react/display-name */
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  MutableRefObject,
  useEffect,
  useRef,
} from 'react';
import Error from '@mui/icons-material/Error';
import Search from '@mui/icons-material/Search';
import Undo from '@mui/icons-material/Undo';
import {
  CircularProgress,
  IconButton,
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
  inputRef?: MutableRefObject<HTMLInputElement | undefined>;
  /** Puts removed scopes back. Absent when there is nothing to put back. */
  onUndo?: () => void;
  /** Scope pills, shown inside the field ahead of what is typed */
  scopes?: React.ReactNode;
}

const SearchField: React.FunctionComponent<SearchFieldProps> = ({
  onChange,
  onKeyDown,
  loading,
  error,
  inputRef,
  onUndo,
  scopes,
}) => {
  const msg = useMessages(messageIds);
  const ownRef = useRef<HTMLInputElement>();
  const input = inputRef || ownRef;

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
        endAdornment: onUndo ? (
          <Tooltip title={msg.scope.undo()}>
            <IconButton
              data-testid="SearchDialog-undoButton"
              onClick={onUndo}
              size="small"
            >
              <Undo fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : undefined,
        startAdornment: (
          <>
            <SearchFieldIcon error={error} loading={loading} />
            {scopes}
          </>
        ),
        // Let the pills and the input share the row, wrapping when needed
        sx: {
          '& input': { flex: 1, minWidth: '8em' },
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          paddingY: 0.5,
        },
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
