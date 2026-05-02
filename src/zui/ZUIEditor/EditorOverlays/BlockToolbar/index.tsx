import { FC } from 'react';
import { FromToProps } from 'remirror';
import { Attrs } from '@remirror/pm/model';
import { Crop75 } from '@mui/icons-material';
import { Box } from '@mui/material';

import { BlockType } from '..';
import ParagraphToolbar from './toolbars/ParagraphToolbar';
import HeadingToolbar from './toolbars/HeadingToolbar';
import BlockToolbarBase from './toolbars/BlockToolbarBase';
import { useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import ImageToolbar from './toolbars/ImageToolbar';
import OrderedListToolbar from './toolbars/OrderedListToolbar';
import BulletListToolbar from './toolbars/BulletListToolbar';

type BlockToolbarProps = {
  blockAttributes: Attrs;
  blockIndex: number;
  blockType: BlockType;
  curBlockY: number;
  enableBold: boolean;
  enableItalic: boolean;
  enableLink: boolean;
  enableStrikethrough: boolean;
  enableVariable: boolean;
  onDragEnd: () => void;
  onDragStart: (index: number) => void;
  range: FromToProps;
};

const BlockToolbar: FC<BlockToolbarProps> = ({
  blockAttributes,
  blockIndex,
  blockType,
  curBlockY,
  enableLink,
  enableStrikethrough,
  enableVariable,
  enableItalic,
  enableBold,
  onDragEnd,
  onDragStart,
  range,
}) => {
  const messages = useMessages(messageIds);
  return (
    <Box position="relative">
      <Box
        minWidth={280}
        sx={{
          left: 5,
          position: 'absolute',
          top: curBlockY - 60,
          transition: 'opacity 0.5s',
          zIndex: 2,
        }}
      >
        {blockType == 'paragraph' && (
          <ParagraphToolbar
            blockIndex={blockIndex}
            enableBold={enableBold}
            enableItalic={enableItalic}
            enableLink={enableLink}
            enableStrikethrough={enableStrikethrough}
            enableVariable={enableVariable}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            range={range}
          />
        )}
        {blockType == 'heading' && (
          <HeadingToolbar
            blockIndex={blockIndex}
            enableVariable={enableVariable}
            headingLevel={blockAttributes.level}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            range={range}
          />
        )}
        {blockType == 'zbutton' && (
          <BlockToolbarBase
            blockIndex={blockIndex}
            icon={<Crop75 />}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            range={range}
            title={messages.editor.blockLabels.zbutton()}
          />
        )}
        {blockType == 'zimage' && (
          <ImageToolbar
            blockIndex={blockIndex}
            fileId={blockAttributes.fileId}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            range={range}
          />
        )}
        {blockType == 'orderedList' && (
          <OrderedListToolbar
            blockIndex={blockIndex}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            range={range}
          />
        )}
        {blockType == 'bulletList' && (
          <BulletListToolbar
            blockIndex={blockIndex}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            range={range}
          />
        )}
      </Box>
    </Box>
  );
};

export default BlockToolbar;
