import { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  Autocomplete,
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { AddLocation, LocationOn, Search } from '@mui/icons-material';
import Fuse from 'fuse.js';

import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';
import { useApiClient } from 'core/hooks';
import searchLocation from 'features/events/rpc/searchLocation';

interface LocationSearchProps {
  onChange: (value: ZetkinLocation) => void;
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
  options: existingLocations,
}) => {
  const messages = useMessages(messageIds);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [geocodedOptions, setGeocodedOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(true);

  const apiClient = useApiClient();
  const lastGeocodeQueryString = useRef<string>('');
  const lastFuseQueryString = useRef<string>('');

  useEffect(() => {
    if (inputValue === '') {
      setGeocodedOptions([]);
      return;
    }

    if (!open || lastGeocodeQueryString.current === inputValue) {
      return;
    }

    setHasLoaded(false);
    const debounceTimeout = window.setTimeout(async () => {
      setLoading(true);
      const res: ZetkinLocation[] = await apiClient.rpc(
        searchLocation,
        inputValue
      );
      lastGeocodeQueryString.current = inputValue;
      const options: Option[] = res.map((r) => ({
        id: `${Math.random()}`,
        label: r.title,
        location: r,
      }));
      setGeocodedOptions(options);
      setLoading(false);
      setHasLoaded(true);
    }, 1000);
    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [inputValue, open, apiClient]);

  const theme = useTheme();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const existingLocationsFuse = new Fuse(existingLocations, {
    keys: ['title'],
    threshold: 0.5,
  });
  const [matchingExistingLocations, setMatchingExistingLocations] = useState<
    ZetkinLocation[]
  >([]);

  useEffect(() => {
    if (!open || lastFuseQueryString.current === inputValue) {
      return;
    }
    const matchingLocations = inputValue
      ? existingLocationsFuse.search(inputValue).map((r) => r.item)
      : existingLocations;
    setMatchingExistingLocations(matchingLocations);
    lastFuseQueryString.current = inputValue;
  }, [inputValue, open]);

  const options: Option[] = useMemo(() => {
    if (!hasLoaded) {
      return [];
    }
    const existingOptionsByTitle = matchingExistingLocations.reduce(
      (prev, cur) => {
        prev[cur.title.toLowerCase()] = cur;
        return prev;
      },
      {} as Record<string, ZetkinLocation>
    );
    return [
      ...matchingExistingLocations.map((loc) => ({
        id: loc.id + '',
        label: loc.title,
        location: loc,
      })),
      ...geocodedOptions.filter((loc) => {
        const existingOption =
          existingOptionsByTitle[loc.location.title.toLowerCase()];
        if (!existingOption) {
          return true;
        }
        return !(
          Math.abs(loc.location.lng - existingOption.lng) <= 1e-5 &&
          Math.abs(loc.location.lat - existingOption.lat) <= 1e-5
        );
      }),
    ];
  }, [matchingExistingLocations, geocodedOptions, hasLoaded]);

  return (
    <Autocomplete<Option, false, false, false>
      blurOnSelect={true}
      clearOnBlur={false}
      filterOptions={(options) => options}
      fullWidth
      getOptionLabel={(o) => o.label}
      inputValue={inputValue}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      loading={loading}
      onChange={(_, value) => {
        if (!value) {
          return;
        }

        lastGeocodeQueryString.current = value.label;
        lastFuseQueryString.current = value.label;
        onChange(value.location);
      }}
      onClose={() => setOpen(false)}
      onInputChange={(_, value) => {
        setInputValue(value);
      }}
      onOpen={() => setOpen(true)}
      open={open && inputValue !== ''}
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
            <Box
              onClick={() => {
                lastGeocodeQueryString.current = option.label;
                onChange(option.location);
              }}
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row',
                gap: '5px',
              }}
            >
              {option.location.id === -1 ? <AddLocation /> : <LocationOn />}
              <Box>
                <Typography sx={{ fontSize: '16px' }}>
                  {option.label}
                </Typography>
                <Typography
                  sx={{ color: theme.palette.grey['800'], fontSize: '12px' }}
                >
                  {option.location.info_text}
                </Typography>
              </Box>
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
