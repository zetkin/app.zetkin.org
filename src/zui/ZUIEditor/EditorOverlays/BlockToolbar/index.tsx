import { FC } from 'react';
import { FromToProps } from 'remirror';
import { Attrs } from '@remirror/pm/model';
import { CheckBoxOutlineBlank } from '@mui/icons-material';

import { BlockType } from '..';
import ParagraphToolbar from './toolbars/ParagraphToolbar';
import HeadingToolbar from './toolbars/HeadingToolbar';
import BlockToolbarBase from './toolbars/BlockToolbarBase';
import { useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import ImageToolbar from './toolbars/ImageToolbar';

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
  if (blockType == 'paragraph') {
    return (
      <ParagraphToolbar
        curBlockY={curBlockY}
        enableBold={enableBold}
        enableItalic={enableItalic}
        enableLink={enableLink}
        enableVariable={enableVariable}
        range={range}
      />
    );
  } else if (blockType == 'heading') {
    return (
      <HeadingToolbar
        curBlockY={curBlockY}
        enableVariable={enableVariable}
        headingLevel={blockAttributes.level}
        range={range}
      />
    );
  } else if (blockType == 'zbutton') {
    return (
      <BlockToolbarBase
        curBlockY={curBlockY}
        icon={<CheckBoxOutlineBlank />}
        range={range}
        title={messages.editor.blockLabels.zbutton()}
      />
    );
  } else if (blockType == 'zimage') {
    return (
      <ImageToolbar
        curBlockY={curBlockY}
        range={range}
        src={blockAttributes.src}
      />
    );
  } else {
    return <> </>;
  }
};

export default BlockToolbar;
