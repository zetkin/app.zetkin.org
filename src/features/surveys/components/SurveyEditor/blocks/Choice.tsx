import { Close } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { Box, IconButton, TextField } from '@mui/material';
import { Ref, useState } from 'react';

import { WidgetType } from './ChoiceQuestionBlock';
import { ZetkinSurveyOption } from 'utils/types/zetkin';

interface ChoiceProps {
  option: ZetkinSurveyOption;
  onDeleteOption: (optionId: number) => void;
  onUpdateOption: (optionId: number, text: string) => void;
  inputRef: Ref<HTMLInputElement>;
  widgetType: WidgetType;
}

const Choice = ({
  option,
  onDeleteOption,
  onUpdateOption,
  inputRef,
  widgetType,
}: ChoiceProps) => {
  const intl = useIntl();
  const [value, setValue] = useState(option.text);
  return (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="center"
      paddingTop={2}
      width="100%"
    >
      <Box paddingX={2}>{widgetType.previewIcon}</Box>
      <TextField
        fullWidth
        InputProps={{
          inputRef: inputRef,
        }}
        label={intl.formatMessage({
          id: 'misc.surveys.blocks.choiceQuestion.option',
        })}
        onBlur={() => onUpdateOption(option.id, value)}
        onChange={(evt) => setValue(evt.target.value)}
        sx={{ paddingLeft: 1 }}
        value={value}
      />
      <IconButton
        onClick={() => onDeleteOption(option.id)}
        sx={{ paddingX: 2 }}
      >
        <Close />
      </IconButton>
    </Box>
  );
};

export default Choice;
