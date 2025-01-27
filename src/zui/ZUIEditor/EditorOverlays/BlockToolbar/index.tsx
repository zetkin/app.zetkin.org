import { FC } from 'react';
import { FromToProps } from 'remirror';

import { BlockType } from '..';
import ParagraphToolbar from './toolbars/ParagraphToolbar';

type BlockToolbarProps = {
  blockType: BlockType;
  curBlockY: number;
  enableBold: boolean;
  enableItalic: boolean;
  enableLink: boolean;
  enableVariable: boolean;
  range: FromToProps;
};

const BlockToolbar: FC<BlockToolbarProps> = ({
  blockType,
  curBlockY,
  enableLink,
  enableVariable,
  enableItalic,
  enableBold,
  range,
}) => {
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
  } else {
    return <> </>;
  }
};

export default BlockToolbar;
