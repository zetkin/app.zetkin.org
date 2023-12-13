import timezones from 'timezones-list';
import { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

import messageIds from 'zui/l10n/messageIds';
import { useMessages } from 'core/i18n';

type TimezoneType = {
  label: string;
  name: string;
  tzCode: string;
  utc: string;
};
interface ZUITimezonePickerProps {
  onChange: (value: TimezoneType) => void;
}

const ZUITimezonePicker = ({ onChange }: ZUITimezonePickerProps) => {
  const messages = useMessages(messageIds);
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [value, setValue] = useState(
    timezones.find((timezone) => timezone.tzCode === currentTimezone)
  );
  return (
    <Autocomplete
      fullWidth
      onChange={(_, value) => {
        if (value !== null) {
          setValue(value);
          onChange(value);
        }
      }}
      options={timezones}
      renderInput={(params) => (
        <TextField {...params} label={messages.timezone()} />
      )}
      value={value}
    />
  );
};

export default ZUITimezonePicker;
