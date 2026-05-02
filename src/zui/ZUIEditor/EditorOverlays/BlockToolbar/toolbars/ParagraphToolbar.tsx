import { FC } from 'react';
import { FromToProps } from 'remirror';
import { Box, ButtonGroup } from '@mui/material';
import { useCommands } from '@remirror/react';
import { Notes } from '@mui/icons-material';

import { useMessages } from 'core/i18n';
import BlockToolbarBase from './BlockToolbarBase';
import messageIds from 'zui/l10n/messageIds';
import BoldToolButton from '../buttons/BoldToolButton';
import ItalicToolButton from '../buttons/ItalicToolButton';
import LinkToolButton from '../buttons/LinkToolButton';
import VariableToolButton from '../buttons/VariableToolButton';
import StrikethroughToolButton from 'zui/ZUIEditor/EditorOverlays/BlockToolbar/buttons/StrikethroughToolButton';

type ParagraphToolbarProps = {
  blockIndex: number;
  enableBold: boolean;
  enableItalic: boolean;
  enableLink: boolean;
  enableStrikethrough: boolean;
  enableVariable: boolean;
  onDragEnd: () => void;
  onDragStart: (index: number) => void;
  range: FromToProps;
};

const ParagraphToolbar: FC<ParagraphToolbarProps> = ({
  blockIndex,
  enableBold,
  enableItalic,
  enableLink,
  enableStrikethrough,
  enableVariable,
  onDragEnd,
  onDragStart,
  range,
}) => {
  const messages = useMessages(messageIds);
  const { toggleHeading } = useCommands();

  return (
    <BlockToolbarBase
      blockIndex={blockIndex}
      conversions={[
        {
          label: messages.editor.toolbar.conversions.heading(),
          onClick: () => toggleHeading(),
        },
      ]}
      icon={<Notes />}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      range={range}
      title={messages.editor.blockLabels.paragraph()}
      tools={
        <Box display="flex" gap={1}>
          <ButtonGroup size="small">
            {enableBold && <BoldToolButton />}
            {enableItalic && <ItalicToolButton />}
            {enableStrikethrough && <StrikethroughToolButton />}
          </ButtonGroup>
          <ButtonGroup size="small">
            {enableLink && <LinkToolButton />}
            {enableVariable && <VariableToolButton />}
          </ButtonGroup>
        </Box>
      }
    />
  );
};

export default ParagraphToolbar;
