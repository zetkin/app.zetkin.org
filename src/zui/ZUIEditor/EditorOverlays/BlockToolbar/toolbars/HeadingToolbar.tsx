import { FC, useState } from 'react';
import { FromToProps } from 'remirror';
import { useCommands } from '@remirror/react';
import { Title } from '@mui/icons-material';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import BlockToolbarBase from './BlockToolbarBase';
import messageIds from 'zui/l10n/messageIds';
import VariableToolButton from '../buttons/VariableToolButton';
import { Msg, useMessages } from 'core/i18n';

type HeadingToolbarProps = {
  curBlockY: number;
  enableVariable: boolean;
  headingLevel: number;
  range: FromToProps;
};

const HeadingToolbar: FC<HeadingToolbarProps> = ({
  curBlockY,
  enableVariable,
  headingLevel,
  range,
}) => {
  const messages = useMessages(messageIds);
  const { convertParagraph, toggleHeading } = useCommands();

  const [level, setLevel] = useState(headingLevel ?? 1);

  return (
    <BlockToolbarBase
      conversions={[
        {
          label: messages.editor.blockLabels.paragraph(),
          onClick: () => convertParagraph(),
        },
      ]}
      curBlockY={curBlockY}
      icon={<Title />}
      range={range}
      title={messages.editor.blockLabels.heading()}
      tools={
        <Box display="flex" gap={1}>
          <FormControl>
            <InputLabel id="level-select-label">
              <Msg id={messageIds.editor.extensions.heading.level} />
            </InputLabel>
            <Select
              label="Level"
              labelId="level-select-label"
              onChange={(ev) => {
                const value = ev.target.value as number;
                toggleHeading({ level: value });
                setLevel(value);
              }}
              size="small"
              value={level}
            >
              <MenuItem value={1}>
                <Msg id={messageIds.editor.extensions.heading.large} />
              </MenuItem>
              <MenuItem value={2}>
                <Msg id={messageIds.editor.extensions.heading.medium} />
              </MenuItem>
              <MenuItem value={3}>
                <Msg id={messageIds.editor.extensions.heading.small} />
              </MenuItem>
            </Select>
          </FormControl>
          {enableVariable && <VariableToolButton />}
        </Box>
      }
    />
  );
};

export default HeadingToolbar;
