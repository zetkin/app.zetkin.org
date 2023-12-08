import timezones from 'timezones-list';
import { Autocomplete, TextField } from '@mui/material';

import messageIds from 'zui/l10n/messageIds';
import { useMessages } from 'core/i18n';
export type TimezoneType = {
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

  return (
    <Autocomplete
      fullWidth
      id="combo-box-demo"
      onChange={(_, value) => {
        if (value !== null) {
          onChange(value);
        }
      }}
      options={timezones}
      renderInput={(params) => (
        <TextField {...params} label={messages.timezone()} />
      )}
    />
  );
};

export default ZUITimezonePicker;
