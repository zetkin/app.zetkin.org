import { MenuItem, TextField } from '@mui/material';
import { FC } from 'react';

import { useMessages } from 'core/i18n';
import { BulkSubOp } from 'features/import/types';
import messageIds from '../l10n/messageIds';

type Props = {
  onChange: (newValue: BulkSubOp['op']) => void;
  value: BulkSubOp['op'] | null;
};

const AutomationOpSelect: FC<Props> = ({ onChange, value }) => {
  const messages = useMessages(messageIds);
  const options: Record<BulkSubOp['op'], string> = {
    'person.addtoorg': messages.opConfig.opTypes.addToOrg.typeLabel(),
    'person.setfields': messages.opConfig.opTypes.setFields.typeLabel(),
    'person.tag': messages.opConfig.opTypes.tag.typeLabel(),
  };

  return (
    <TextField
      fullWidth
      label={messages.opConfig.opTypeLabel()}
      onChange={(ev) => onChange(ev.target.value as BulkSubOp['op'])}
      select
      value={value}
    >
      {Object.entries(options).map(([value, label]) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default AutomationOpSelect;
