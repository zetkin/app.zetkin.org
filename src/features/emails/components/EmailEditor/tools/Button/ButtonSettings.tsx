import NextLink from 'next/link';
import { Box, IconButton, Link, TextField, Typography } from '@mui/material';
import { Close, OpenInNew } from '@mui/icons-material';
import { FC, useState } from 'react';

import { ButtonData } from '.';
import formatUrl from './utils/formatUrl';
import messageIds from 'features/emails/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

interface ButtonSettingsProps {
  url: ButtonData['url'];
  onChange: (newUrl: ButtonData['url']) => void;
}

const ButtonSettings: FC<ButtonSettingsProps> = ({ url, onChange }) => {
  const messages = useMessages(messageIds);
  const [inputValue, setInputValue] = useState(url || '');

  const formattedUrl = formatUrl(inputValue);
  const error = inputValue.length > 0 && formattedUrl.length == 0;

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Typography textTransform="uppercase" variant="body2">
        <Msg id={messageIds.tools.button.settings.linkHeader} />
      </Typography>
      <TextField
        InputProps={{
          endAdornment:
            inputValue.length > 0 ? (
              <IconButton
                onClick={() => {
                  setInputValue('');
                }}
              >
                <Close />
              </IconButton>
            ) : (
              ''
            ),
        }}
        label={messages.tools.button.settings.urlLabel()}
        onChange={(ev) => {
          setInputValue(ev.target.value);
          if (!error) {
            onChange(formatUrl(ev.target.value));
          }
        }}
        value={inputValue}
      />
      {error && (
        <Typography color="error" variant="body2">
          <Msg id={messageIds.tools.button.settings.invalidUrl} />
        </Typography>
      )}
      {inputValue.length > 0 && !error && (
        <NextLink href={formattedUrl} passHref rel="">
          <Link display="flex" rel="noopener" target="_blank" underline="none">
            <OpenInNew
              color="secondary"
              fontSize="small"
              sx={{ marginRight: 1 }}
            />
            <Typography variant="body2">
              <Msg id={messageIds.tools.button.settings.testLink} />
            </Typography>
          </Link>
        </NextLink>
      )}
    </Box>
  );
};

export default ButtonSettings;
