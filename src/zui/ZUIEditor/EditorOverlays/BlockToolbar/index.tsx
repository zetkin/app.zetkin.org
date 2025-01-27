import { FC } from 'react';
import { FromToProps } from 'remirror';
import { Attrs } from '@remirror/pm/model';

import { BlockType } from '..';
import ParagraphToolbar from './toolbars/ParagraphToolbar';
import HeadingToolbar from './toolbars/HeadingToolbar';

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
  } else {
    return <> </>;
  }
};

export default BlockToolbar;
