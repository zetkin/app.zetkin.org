import { FC } from 'react';
import { ZetkinSurveyTextQuestionElement } from 'utils/types/zetkin';
import { FormControl, FormLabel, TextField } from '@mui/material';

const OptionsQuestion: FC<{ element: ZetkinSurveyTextQuestionElement }> = ({
  element,
}) => {
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">
        {element.question.question}
      </FormLabel>
      <TextField
        id={`input-${element.id}`}
        name={`${element.id}.text`}
        type="text"
      />
    </FormControl>
  );
};

export default OptionsQuestion;
