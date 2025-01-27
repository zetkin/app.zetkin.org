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

type ParagraphToolbarProps = {
  curBlockY: number;
  enableBold: boolean;
  enableItalic: boolean;
  enableLink: boolean;
  enableVariable: boolean;
  range: FromToProps;
};

const ParagraphToolbar: FC<ParagraphToolbarProps> = ({
  curBlockY,
  enableBold,
  enableItalic,
  enableLink,
  enableVariable,
  range,
}) => {
  const messages = useMessages(messageIds);
  const { toggleHeading } = useCommands();

  return (
    <BlockToolbarBase
      conversions={[
        {
          label: messages.editor.blockLabels.heading(),
          onClick: () => toggleHeading(),
        },
      ]}
      curBlockY={curBlockY}
      icon={<Notes />}
      range={range}
      title={messages.editor.blockLabels.paragraph()}
      tools={
        <Box display="flex" gap={1}>
          <ButtonGroup size="small">
            {enableBold && <BoldToolButton />}
            {enableItalic && <ItalicToolButton />}
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
