import copy from 'copy-to-clipboard';
import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (copied) {
      setCopied(false);
    }
  }, []);

  return (
    <Box display="flex" gap={1}>
      <Box
        alignItems="center"
        border={1}
        borderColor="lightgray"
        borderRadius={1}
        display="flex"
        paddingX={1}
      >
        {children}
      </Box>
      <Button onClick={handleClick} variant="outlined">
        {copied ? (
          <Msg id="misc.copyToClipboard.copied" />
        ) : (
          <Msg id="misc.copyToClipboard.copy" />
        )}
      </Button>
    </Box>
  );
};

export default ZUITextfieldToClipboard;
