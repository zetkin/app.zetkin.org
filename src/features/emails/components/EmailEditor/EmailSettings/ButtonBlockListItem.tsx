import NextLink from 'next/link';
import { Box, IconButton, Link, TextField, Typography } from '@mui/material';
import { Close, OpenInNew } from '@mui/icons-material';
import { FC, useState } from 'react';

import BlockListItemBase from './BlockListItemBase';
import { ButtonData } from '../tools/Button';
import formatUrl from './utils/formatUrl';
import messageIds from 'features/emails/l10n/messageIds';
import useDebounce from 'utils/hooks/useDebounce';
import { Msg, useMessages } from 'core/i18n';

interface ButtonBlockLIstItemProps {
  data: ButtonData;
  hasErrors: boolean;
  onChange: (data: ButtonData) => void;
  readOnly: boolean;
  selected: boolean;
}

const ButtonBlockListItem: FC<ButtonBlockLIstItemProps> = ({
  data,
  hasErrors,
  onChange,
  readOnly,
  selected,
}) => {
  const messages = useMessages(messageIds);
  const [inputValue, setInputValue] = useState(data.url || '');

  const debouncedFinishedTyping = useDebounce(async (data: ButtonData) => {
    onChange(data);
  }, 400);

  const error = inputValue.length > 0 && !formatUrl(inputValue);
  return (
    <BlockListItemBase
      excerpt={data.buttonText}
      hasErrors={hasErrors}
      readOnly={readOnly}
      selected={selected}
      title={
        data.buttonText
          ? messages.editor.tools.button.title()
          : messages.editor.tools.button.settings.defaultButtonTextWarning()
      }
    >
      <Box display="flex" flexDirection="column">
        <Box paddingBottom={1} paddingTop={2}>
          <TextField
            fullWidth
            InputProps={{
              endAdornment:
                inputValue.length > 0 ? (
                  <IconButton
                    onClick={() => {
                      setInputValue('');
                      debouncedFinishedTyping({ ...data, url: '' });
                    }}
                  >
                    <Close />
                  </IconButton>
                ) : (
                  ''
                ),
            }}
            label={messages.editor.tools.button.settings.urlLabel()}
            onChange={(ev) => {
              setInputValue(ev.target.value);
              debouncedFinishedTyping({
                ...data,
                url: formatUrl(ev.target.value) || '',
              });
            }}
            value={inputValue}
          />
        </Box>
        <Box height="1.25em">
          {error && (
            <Typography color="error" variant="body2">
              <Msg id={messageIds.editor.tools.button.settings.invalidUrl} />
            </Typography>
          )}
          {inputValue.length > 0 && !error && (
            <NextLink
              href={formatUrl(inputValue) || ''}
              passHref
              style={{ textDecoration: 'none' }}
              target="_blank"
            >
              <Link
                display="flex"
                rel="noopener"
                target="_blank"
                underline="none"
              >
                <OpenInNew
                  color="secondary"
                  fontSize="small"
                  sx={{ marginRight: 1 }}
                />
                <Typography color="secondary" variant="body2">
                  <Msg id={messageIds.editor.tools.button.settings.testLink} />
                </Typography>
              </Link>
            </NextLink>
          )}
        </Box>
      </Box>
    </BlockListItemBase>
  );
};

export default ButtonBlockListItem;
