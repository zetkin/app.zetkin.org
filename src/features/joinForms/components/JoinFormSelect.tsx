import { FC } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

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
  const messages = useMessages(messageIds);

  const onChange = (event: SelectChangeEvent<number>) => {
    if (event.target.value === 'all') {
      onFormSelect(undefined);
    } else {
      onFormSelect(forms.find((f) => f.id === event.target.value)!);
    }
  };

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>{messages.forms()}</InputLabel>
      <Select
        label={messages.forms()}
        onChange={onChange}
        placeholder={messages.forms()}
        value={formId}
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
