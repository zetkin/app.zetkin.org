import { FC, useEffect, useRef, useState } from 'react';
import {
  Autocomplete,
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Search } from '@mui/icons-material';

import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';
import { useApiClient } from 'core/hooks';
import searchLocation from 'features/events/rpc/searchLocation';

interface LocationSearchProps {
  onChange: (value: ZetkinLocation) => void;
  onInputChange: (value: string) => void;
  onTextFieldChange: (value: string) => void;
  onClickGeolocate: () => void;
  options: ZetkinLocation[];
}

type Option = {
  id: string;
  label: string;
  location: ZetkinLocation;
};

const LocationSearch: FC<LocationSearchProps> = ({
  onChange,
  onTextFieldChange,
}) => {
  const messages = useMessages(messageIds);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const apiClient = useApiClient();
  const lastQueryString = useRef<string>('');

  useEffect(() => {
    if (inputValue === '') {
      setOptions([]);
      return;
    }

    if (!open || lastQueryString.current === inputValue) {
      return;
    }

    const debounceTimeout = window.setTimeout(async () => {
      setLoading(true);
      const res: ZetkinLocation[] = await apiClient.rpc(
        searchLocation,
        inputValue
      );
      lastQueryString.current = inputValue;
      const options: Option[] = res.map((r) => ({
        id: `${Math.random()}`,
        label: r.title,
        location: r,
      }));
      setOptions(options);
      setLoading(false);
    }, 300);
    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [inputValue, open, apiClient]);

  const theme = useTheme();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Autocomplete<Option, false, false, false>
      blurOnSelect={true}
      clearOnBlur={false}
      fullWidth
      getOptionLabel={(o) => o.label}
      inputValue={inputValue}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      loading={loading}
      onChange={(_, value) => {
        if (!value) {
          return;
        }

        lastQueryString.current = value.label;
        onChange(value.location);
      }}
      onClose={() => setOpen(false)}
      onInputChange={(_, value) => {
        setInputValue(value);
      }}
      onOpen={() => setOpen(true)}
      open={open}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
            startAdornment: (
              <InputAdornment position={'start'}>
                <Search />
              </InputAdornment>
            ),
          }}
          inputRef={inputRef}
          onChange={(ev) => onTextFieldChange(ev.target.value)}
          placeholder={messages.locationModal.searchBox()}
          sx={{
            backgroundColor: 'white',
            borderRadius: '5px',
          }}
          variant={'outlined'}
        />
      )}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.id}>
            <Box>
              <Typography sx={{ fontSize: '16px' }}>{option.label}</Typography>
              <Typography
                sx={{ color: theme.palette.grey['800'], fontSize: '12px' }}
              >
                {option.location.info_text}
              </Typography>
            </Box>
          </li>
        );
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          paddingRight: '10px!important',
          pointerEvents: 'auto',
        },
        maxWidth: '40vw',
        pointerEvents: 'none',
        width: '300px',
      }}
    />
  );
};

export default LocationSearch;
