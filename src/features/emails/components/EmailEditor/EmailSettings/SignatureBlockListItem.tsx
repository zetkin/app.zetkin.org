import { FC, useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import { Stack, TextField } from '@mui/material';

import BlockListItemBase from './BlockListItemBase';
import messageIds from 'features/emails/l10n/messageIds';
import { SignatureData } from 'features/emails/types';
import useDebounce from 'utils/hooks/useDebounce';
import { useMessages } from 'core/i18n';

interface SignatureBlockListItemProps {
  data: SignatureData;
  hasErrors: boolean;
  onChange: (data: SignatureData) => void;
  readOnly: boolean;
  selected: boolean;
}

const SignatureBlockListItem: FC<SignatureBlockListItemProps> = ({
  data,
  hasErrors,
  onChange,
  readOnly,
  selected,
}) => {
  const messages = useMessages(messageIds).editor.tools.signature;
  const [values, setValues] = useState(data);
  const saveChanges = useDebounce(async (updated: SignatureData) => {
    onChange(updated);
  }, 400);

  const updateField = (field: keyof SignatureData, value: string) => {
    const updated = { ...values, [field]: value };
    setValues(updated);
    saveChanges(updated);
  };

  return (
    <BlockListItemBase
      excerpt={[data.name, data.email, data.phone].filter(Boolean).join(', ')}
      hasErrors={hasErrors}
      readOnly={readOnly}
      selected={selected}
      title={messages.title()}
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        <TextField
          error={!values.name?.trim()}
          fullWidth
          helperText={!values.name?.trim() ? messages.nameRequired() : ''}
          label={messages.name()}
          onChange={(event) => updateField('name', event.target.value)}
          required
          value={values.name || ''}
        />
        <TextField
          fullWidth
          label={messages.senderTitle()}
          onChange={(event) => updateField('title', event.target.value)}
          value={values.title || ''}
        />
        <TextField
          fullWidth
          label={messages.organization()}
          onChange={(event) => updateField('organization', event.target.value)}
          value={values.organization || ''}
        />
        <TextField
          error={!isEmail(values.email || '')}
          fullWidth
          helperText={
            !isEmail(values.email || '') ? messages.invalidEmail() : ''
          }
          label={messages.email()}
          onChange={(event) => updateField('email', event.target.value)}
          required
          type="email"
          value={values.email || ''}
        />
        <TextField
          fullWidth
          label={messages.phone()}
          onChange={(event) => updateField('phone', event.target.value)}
          type="tel"
          value={values.phone || ''}
        />
      </Stack>
    </BlockListItemBase>
  );
};

export default SignatureBlockListItem;
