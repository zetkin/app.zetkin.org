import copy from 'copy-to-clipboard';
import { Box, Fade, IconButton } from '@mui/material';
import React, { useContext, useState } from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

import { useMessages } from 'core/i18n';
import ZUISnackbarContext from './ZUISnackbarContext';

import messageIds from './l10n/messageIds';

interface IconProps {
  size?: number;
  svgProps?: SvgIconProps;
  color?: 'inherit' | 'disabled' | 'action' | 'secondary' | 'primary' | 'error';
  htmlColor?: string;
}

export const CopyIcon = ({
  size,
  color,
  htmlColor,
  svgProps,
}: IconProps): JSX.Element => {
  return (
    <SvgIcon
      color={color}
      htmlColor={htmlColor}
      style={{ fontSize: size }}
      {...svgProps}
      viewBox="0 0 24 24"
    >
      <g>
        <path d="M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z" />
      </g>
    </SvgIcon>
  );
};

const ZUIInlineCopyToClipboard: React.FunctionComponent<{
  alwaysShowIcon?: boolean;
  children: React.ReactNode;
  clickableChildren?: boolean;
  copyText: string | number | boolean;
}> = ({
  alwaysShowIcon = false,
  children,
  clickableChildren = false,
  copyText,
}) => {
  const messages = useMessages(messageIds);
  const [hover, setHover] = useState<boolean>(false);

  const { showSnackbar } = useContext(ZUISnackbarContext);

  const handleClick = () => {
    const str = copyText.toString();
    copy(str);
    showSnackbar(
      'success',
      messages.copyToClipboard.copiedValue({
        value: str.length > 30 ? str.slice(0, 30) + '…' : str,
      })
    );
  };

  return (
    <Box
      alignItems="center"
      display="inline-flex"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Box onClick={clickableChildren ? handleClick : undefined}>
        {children}
      </Box>
      <Fade in={hover || alwaysShowIcon}>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          height={40}
          position="relative"
        >
          <IconButton onClick={handleClick}>
            <CopyIcon />
          </IconButton>
        </Box>
      </Fade>
    </Box>
  );
};

export default ZUIInlineCopyToClipboard;
