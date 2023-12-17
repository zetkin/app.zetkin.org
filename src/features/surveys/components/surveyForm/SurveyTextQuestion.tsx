import { FC } from 'react';
import SurveySubheading from './SurveySubheading';
import { ZetkinSurveyTextQuestionElement } from 'utils/types/zetkin';
import { FormControl, FormLabel, TextField } from '@mui/material';

export type SurveyOptionsQuestionProps = {
  element: ZetkinSurveyTextQuestionElement;
  formData: NodeJS.Dict<string | string[]>;
};

const SurveyOptionsQuestion: FC<SurveyOptionsQuestionProps> = ({
  element,
  formData,
}) => {
  return (
    <FormControl sx={{ width: '100%' }}>
      <FormLabel htmlFor={`input-${element.id}`}>
        <SurveySubheading>{element.question.question}</SurveySubheading>
      </FormLabel>
      <TextField
        defaultValue={
          typeof formData[`${element.id}.text`] === 'string'
            ? (formData[`${element.id}.text`] as string)
            : undefined
        }
        fullWidth
        id={`input-${element.id}`}
        name={`${element.id}.text`}
        type="text"
      />
    </FormControl>
  );
};

export default SurveyOptionsQuestion;
