import { FC } from 'react';
import { Autocomplete, IconButton, TextField } from '@mui/material';

import messageIds from 'features/events/l10n/messageIds';
import { MyLocation } from '@mui/icons-material';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';

interface LocationSearchProps {
  onChange: (value: ZetkinLocation) => void;
  onInputChange: (value: string) => void;
  onTextFieldChange: (value: string) => void;
  onClickGeolocate: () => void;
  options: ZetkinLocation[];
}

const LocationSearch: FC<LocationSearchProps> = ({
  onChange,
  onClickGeolocate,
  onInputChange,
  onTextFieldChange,
  options,
}) => {
  const messages = useMessages(messageIds);
  return (
    <Autocomplete
      disableClearable
      fullWidth
      getOptionLabel={(option) => option.title}
      onChange={(ev, value) => onChange(value)}
      onInputChange={(ev, value) => onInputChange(value)}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <IconButton onClick={onClickGeolocate}>
                <MyLocation />
              </IconButton>
            ),
          }}
          label={messages.locationModal.searchBox()}
          onChange={(ev) => onTextFieldChange(ev.target.value)}
          sx={{
            backgroundColor: 'white',
            borderRadius: '5px',
          }}
        />
      )}
      sx={{
        '& .MuiOutlinedInput-root': {
          paddingRight: '10px!important',
        },
      }}
    />
  );
};

export default LocationSearch;
