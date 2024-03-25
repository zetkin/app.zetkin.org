import { FC } from 'react';
import { Box, FormControl, TextField } from '@mui/material';

import messageIds from 'features/emails/l10n/messageIds';
import useDebounce from 'utils/hooks/useDebounce';
import useEmailSettings from 'features/emails/hooks/useEmailSettings';
import { useMessages } from 'core/i18n';
import { ZetkinEmail } from 'utils/types/zetkin';

interface SettingsTabProps {
  subject: string;
  onChange: (email: Partial<ZetkinEmail>) => void;
  readOnly: boolean;
}

const SettingsTab: FC<SettingsTabProps> = ({
  subject: initialSubject,
  onChange,
  readOnly,
}) => {
  const messages = useMessages(messageIds);
  const { subject, emailAddress, setSubject, orgTitle } =
    useEmailSettings(initialSubject);

  const debouncedFinishedTyping = useDebounce(async (value: string) => {
    onChange({ subject: value });
  }, 400);

  return (
    <Box display="flex" flexDirection="column" gap={2} padding={2}>
      <FormControl fullWidth>
        <TextField
          disabled
          fullWidth
          label={messages.editor.settings.tabs.settings.senderNameInputLabel()}
          value={orgTitle}
        />
      </FormControl>
      <FormControl fullWidth>
        <TextField
          disabled
          fullWidth
          label={messages.editor.settings.tabs.settings.senderAddressInputLabel()}
          value={emailAddress}
        />
      </FormControl>
      <TextField
        disabled={readOnly}
        fullWidth
        label={messages.editor.settings.tabs.settings.subjectInputLabel()}
        onChange={(event) => {
          setSubject(event.target.value);
          debouncedFinishedTyping(event.target.value);
        }}
        value={subject}
      />
    </Box>
  );
};

export default SettingsTab;
