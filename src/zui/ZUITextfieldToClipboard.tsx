import copy from 'copy-to-clipboard';
import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react';

import { Msg } from 'core/i18n';

import messageIds from './l10n/messageIds';

const ZUITextfieldToClipboard: React.FunctionComponent<{
  children: React.ReactNode;
  copyText: string | number | boolean;
}> = ({ children, copyText }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleClick = () => {
    copy(copyText.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Box display="flex" gap={1} width="100%">
      <TextField
        defaultValue={children}
        fullWidth
        InputProps={{
          readOnly: true,
        }}
        variant="outlined"
      />
      <Button onClick={handleClick} variant="outlined">
        {copied ? (
          <Msg id={messageIds.copyToClipboard.copied} />
        ) : (
          <Msg id={messageIds.copyToClipboard.copy} />
        )}
      </Button>
    </Box>
  );
};

export default ZUITextfieldToClipboard;
