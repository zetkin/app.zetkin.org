import { FC, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Form = { id: number; title: string };

type Props = {
  formId?: number;
  forms?: Form[];
  onFormSelect?: (form?: Form) => void;
};

const JoinFormSelect: FC<Props> = ({
  formId,
  forms = [],
  onFormSelect = () => {},
}) => {
  const [value, setValue] = useState<number | 'all'>(formId || 'all');
  const messages = useMessages(messageIds);

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>{messages.forms()}</InputLabel>
      <Select
        label={messages.forms()}
        onChange={(ev) => {
          const value = ev.target.value;
          setValue(value);
          if (value === 'all') {
            onFormSelect(undefined);
          } else {
            onFormSelect(forms.find((f) => f.id === value));
          }
        }}
        value={value}
      >
        <MenuItem selected={!formId} value="all">
          {messages.submissionPane.allForms()}
        </MenuItem>
        {forms.map((form) => (
          <MenuItem key={form.id} value={form.id}>
            {form.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
export default JoinFormSelect;
