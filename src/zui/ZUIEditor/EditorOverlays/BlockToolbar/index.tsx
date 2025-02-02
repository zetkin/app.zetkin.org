import { FC } from 'react';
import { FromToProps } from 'remirror';
import { Attrs } from '@remirror/pm/model';
import { CheckBoxOutlineBlank } from '@mui/icons-material';
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
  blockType: BlockType;
  curBlockY: number;
  enableBold: boolean;
  enableItalic: boolean;
  enableLink: boolean;
  enableVariable: boolean;
  range: FromToProps;
};

const BlockToolbar: FC<BlockToolbarProps> = ({
  blockAttributes,
  blockType,
  curBlockY,
  enableLink,
  enableVariable,
  enableItalic,
  enableBold,
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
          zIndex: 1,
        }}
      >
        {blockType == 'paragraph' && (
          <ParagraphToolbar
            enableBold={enableBold}
            enableItalic={enableItalic}
            enableLink={enableLink}
            enableVariable={enableVariable}
            range={range}
          />
        )}
        {blockType == 'heading' && (
          <HeadingToolbar
            enableVariable={enableVariable}
            headingLevel={blockAttributes.level}
            range={range}
          />
        )}
        {blockType == 'zbutton' && (
          <BlockToolbarBase
            icon={<CheckBoxOutlineBlank />}
            range={range}
            title={messages.editor.blockLabels.zbutton()}
          />
        )}
        {blockType == 'zimage' && (
          <ImageToolbar range={range} src={blockAttributes.src} />
        )}
        {blockType == 'orderedList' && <OrderedListToolbar range={range} />}
        {blockType == 'bulletList' && <BulletListToolbar range={range} />}
      </Box>
    </Box>
  );
};

export default BlockToolbar;
