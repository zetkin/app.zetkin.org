import { FC } from 'react';
import { Box, TextField } from '@mui/material';

import { ButtonData } from '.';
import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';

interface ButtonSettingsProps {
  url: ButtonData['url'];
  onChange: (newUrl: ButtonData['url']) => void;
}

const ButtonSettings: FC<ButtonSettingsProps> = ({ url, onChange }) => {
  const messages = useMessages(messageIds);

  return (
    <Box>
      <TextField
        defaultValue={url || ''}
        label={messages.tools.button.settings.urlLabel()}
        onChange={(ev) => {
          onChange(ev.target.value);
        }}
      />
    </Box>
  );
};

export default ButtonSettings;
