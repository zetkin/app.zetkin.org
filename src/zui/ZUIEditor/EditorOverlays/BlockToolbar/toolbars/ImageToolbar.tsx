import { FC } from 'react';
import { FromToProps } from 'remirror';
import { Image as ImageIcon } from '@mui/icons-material';
import { Typography } from '@mui/material';

import BlockToolbarBase from './BlockToolbarBase';
import { useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

type ImageToolbarProps = {
  curBlockY: number;
  range: FromToProps;
  src: string;
};

const ImageToolbar: FC<ImageToolbarProps> = ({ curBlockY, src, range }) => {
  const messages = useMessages(messageIds);
  const splitSrc = src.split('/');
  const fileName = splitSrc[splitSrc.length - 1];
  return (
    <BlockToolbarBase
      curBlockY={curBlockY}
      icon={<ImageIcon />}
      range={range}
      title={messages.editor.blockLabels.zimage()}
      tools={<Typography color="secondary">{fileName}</Typography>}
    />
  );
};

export default ImageToolbar;
