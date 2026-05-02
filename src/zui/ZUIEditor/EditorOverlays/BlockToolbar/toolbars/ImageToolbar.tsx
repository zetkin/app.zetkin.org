import { FC } from 'react';
import { FromToProps } from 'remirror';
import { Image as ImageIcon } from '@mui/icons-material';
import { Typography } from '@mui/material';

import BlockToolbarBase from './BlockToolbarBase';
import { useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import useFile from 'features/files/hooks/useFile';

type ImageToolbarProps = {
  blockIndex: number;
  fileId: number | null;
  onDragEnd: () => void;
  onDragStart: (index: number) => void;
  range: FromToProps;
};

const ImageToolbar: FC<ImageToolbarProps> = ({
  blockIndex,
  fileId,
  onDragEnd,
  onDragStart,
  range,
}) => {
  const { orgId } = useNumericRouteParams();

  const messages = useMessages(messageIds);

  const file = useFile(orgId, fileId);
  const fileName = file.data?.original_name || '';

  return (
    <BlockToolbarBase
      blockIndex={blockIndex}
      icon={<ImageIcon />}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      range={range}
      title={messages.editor.blockLabels.zimage()}
      tools={<Typography color="secondary">{fileName}</Typography>}
    />
  );
};

export default ImageToolbar;
