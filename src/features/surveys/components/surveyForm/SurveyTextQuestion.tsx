import { FC } from 'react';
import SurveySubheading from './SurveySubheading';
import { ZetkinSurveyTextQuestionElement } from 'utils/types/zetkin';
import { FormControl, FormLabel, TextField } from '@mui/material';

export type SurveyOptionsQuestionProps = {
  element: ZetkinSurveyTextQuestionElement;
};

const SurveyOptionsQuestion: FC<SurveyOptionsQuestionProps> = ({ element }) => {
  return (
    <FormControl sx={{ width: '100%' }}>
      <FormLabel htmlFor={`input-${element.id}`}>
        <SurveySubheading>{element.question.question}</SurveySubheading>
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

export default SurveyOptionsQuestion;
