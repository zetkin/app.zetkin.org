import { Edit } from '@mui/icons-material';
import Link from 'next/link';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';

import { ActionButtonData } from './types';
import formatUrl from './utils/formatUrl';
import messageIds from 'features/emails/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

interface ActionButtonEditableBlockProps {
  data: ActionButtonData;
  onChange: (data: ActionButtonData) => void;
}

const ActionButtonEditableBlock: FC<ActionButtonEditableBlockProps> = ({
  data,
  onChange,
}) => {
  const messages = useMessages(messageIds);
  const [displayState, setDisplayState] = useState<'edit' | 'preview'>('edit');
  const [buttonText, setButtonText] = useState<string>(data.buttonText || '');
  const [url, setUrl] = useState<string>(data.url || '');

  const hasTextAndUrl = !!buttonText && !!url;
  const hasValidUrl = !!formatUrl(url);

  return (
    <>
      {displayState == 'edit' && (
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography>
            <Msg id={messageIds.buttonTool.editTitle} />
          </Typography>
          <TextField
            label={messages.buttonTool.buttonTextInputLabel()}
            onChange={(event) => setButtonText(event.target.value)}
            value={buttonText}
            variant="outlined"
          />
          <TextField
            error={!!url && !hasValidUrl}
            helperText={
              !!url && !hasValidUrl ? messages.buttonTool.invalidUrl() : ''
            }
            label={messages.buttonTool.urlInputLabel()}
            onChange={(event) => setUrl(event.target.value)}
            value={url}
            variant="outlined"
          />
          <Button
            disabled={!hasTextAndUrl || !hasValidUrl}
            onClick={() => {
              const formattedUrl = formatUrl(url);
              if (formattedUrl) {
                onChange({ buttonText, url: formattedUrl });
                setDisplayState('preview');
              }
            }}
          >
            <Msg id={messageIds.buttonTool.finishedEditingButton} />
          </Button>
        </Box>
      )}
      {displayState == 'preview' && (
        <Box display="flex" justifyContent="center" padding={2}>
          <Link href={formatUrl(url)} passHref>
            <Button style={{ textDecoration: 'none' }} variant="contained">
              {buttonText}
            </Button>
          </Link>
          <IconButton onClick={() => setDisplayState('edit')}>
            <Edit />
          </IconButton>
        </Box>
      )}
    </>
  );
};

export default ActionButtonEditableBlock;
