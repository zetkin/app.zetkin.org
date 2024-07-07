import copy from 'copy-to-clipboard';
import { ButtonBase, Collapse, Fade, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';

import { CopyIcon } from './ZUIInlineCopyToClipBoard';
import { Msg } from 'core/i18n';
import messageIds from './l10n/messageIds';

const ZUICopyToClipboard: React.FunctionComponent<{
  children: React.ReactNode;
  copyText: string | number | boolean;
}> = ({ children, copyText }) => {
  const [hover, setHover] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleClick = () => {
    copy(copyText.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Grid
      component={ButtonBase}
      container
      item
      onClick={handleClick}
      style={{ borderRadius: 5, height: 52, margin: -6, padding: 6 }}
    >
      <Grid
        alignItems="center"
        container
        direction="row"
        justifyContent="space-between"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ cursor: 'pointer' }}
      >
        <Grid item xs={9}>
          {children}
        </Grid>
        <Fade in={hover}>
          <Grid item style={{ textAlign: 'end' }} xs={3}>
            <Collapse in={!copied}>
              <CopyIcon />
            </Collapse>
            <Collapse in={copied}>
              <Typography
                color="secondary"
                style={{ fontSize: 11, fontWeight: 'bold' }}
                variant="button"
              >
                <Msg id={messageIds.copyToClipboard.copied} />
              </Typography>
            </Collapse>
          </Grid>
        </Fade>
      </Grid>
    </Grid>
  );
};

export default ZUICopyToClipboard;
