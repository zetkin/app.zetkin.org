import { FC } from 'react';
import { Autocomplete, TextField } from '@mui/material';

import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';

interface LocationSearchProps {
  onChange: (value: ZetkinLocation) => void;
  onInputChange: (value: string) => void;
  onTextFieldChange: (value: string) => void;
  options: ZetkinLocation[];
}

const LocationSearch: FC<LocationSearchProps> = ({
  onChange,
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
          label={messages.locationModal.searchBox()}
          onChange={(ev) => onTextFieldChange(ev.target.value)}
          sx={{
            backgroundColor: 'white',
            borderRadius: '5px',
          }}
        />
      )}
    />
  );
};

export default LocationSearch;
