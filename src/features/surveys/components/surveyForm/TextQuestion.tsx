import { FC } from 'react';
import { ZetkinSurveyTextQuestionElement } from 'utils/types/zetkin';
import { FormControl, FormLabel, TextField } from '@mui/material';

const OptionsQuestion: FC<{ element: ZetkinSurveyTextQuestionElement }> = ({
  element,
}) => {
  return (
    <FormControl sx={{ width: '100%' }}>
      <FormLabel
        id="demo-radio-buttons-group-label"
        style={{
          color: 'black',
          fontSize: '1.5em',
          fontWeight: '500',
          marginBottom: '0.5em',
          marginTop: '0.5em',
        }}
      >
        {element.question.question}
      </FormLabel>
      <TextField
        fullWidth
        id={`input-${element.id}`}
        name={`${element.id}.text`}
        type="text"
      />
    </FormControl>
  );
};

export default OptionsQuestion;
