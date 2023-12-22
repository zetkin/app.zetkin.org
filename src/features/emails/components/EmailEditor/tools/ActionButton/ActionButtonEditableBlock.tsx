import { Edit } from '@mui/icons-material';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';

import { ActionButtonData } from './types';
import Link from 'next/link';
import messageIds from 'features/emails/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

interface ActionButtonEditableBlockProps {
  data: ActionButtonData;
}

const ActionButtonEditableBlock: FC<ActionButtonEditableBlockProps> = ({
  data,
}) => {
  const messages = useMessages(messageIds);
  const [displayState, setDisplayState] = useState<'edit' | 'preview'>('edit');
  const [buttonText, setButtonText] = useState<string>(data.buttonText || '');
  const [url, setUrl] = useState<string>(data.url || '');

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
            variant="outlined"
          />
          <TextField
            label={messages.buttonTool.urlInputLabel()}
            onChange={(event) => setUrl(event.target.value)}
            variant="outlined"
          />
          <Button onClick={() => setDisplayState('preview')}>
            <Msg id={messageIds.buttonTool.finishedEditingButton} />
          </Button>
        </Box>
      )}
      {displayState == 'preview' && (
        <Box display="flex" justifyContent="center" padding={2}>
          <Link href={url} passHref>
            <Button variant="contained">{buttonText}</Button>
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
