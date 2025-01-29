import { FC } from 'react';
import { FromToProps } from 'remirror';
import { Image as ImageIcon } from '@mui/icons-material';
import { Typography } from '@mui/material';

import BlockToolbarBase from './BlockToolbarBase';
import { useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

type ImageToolbarProps = {
  range: FromToProps;
  src: string;
};

const ImageToolbar: FC<ImageToolbarProps> = ({ src, range }) => {
  const messages = useMessages(messageIds);
  const splitSrc = src.split('/');
  const fileName = splitSrc[splitSrc.length - 1];
  return (
    <BlockToolbarBase
      icon={<ImageIcon />}
      range={range}
      title={messages.editor.blockLabels.zimage()}
      tools={<Typography color="secondary">{fileName}</Typography>}
    />
  );
};

export default ImageToolbar;
