import { FC } from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material';
import {
  ZetkinSurveyOption,
  ZetkinSurveyOptionsQuestionElement,
} from 'utils/types/zetkin';

const OptionsQuestion: FC<{ element: ZetkinSurveyOptionsQuestionElement }> = ({
  element,
}) => {
  return (
    <FormControl>
      <FormLabel
        id={`label-${element.id}`}
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
      {element.question.response_config.widget_type === 'checkbox' && (
        <FormGroup aria-labelledby={`#label-${element.id}`}>
          {element.question.options!.map((option: ZetkinSurveyOption) => (
            <FormControlLabel
              key={option.id}
              control={<Checkbox />}
              label={option.text}
              name={`${element.id}.options`}
              value={option.id}
            />
          ))}
        </FormGroup>
      )}
      {element.question.response_config.widget_type === 'radio' && (
        <RadioGroup
          aria-labelledby={`#label-${element.id}`}
          name={`${element.id}.options`}
        >
          {element.question.options!.map((option: ZetkinSurveyOption) => (
            <FormControlLabel
              key={option.id}
              control={<Radio />}
              label={option.text}
              value={option.id}
            />
          ))}
        </RadioGroup>
      )}
      {element.question.response_config.widget_type === 'select' && (
        <Select
          aria-labelledby="demo-radio-buttons-group-label"
          name={`${element.id}.options`}
        >
          {element.question.options!.map((option: ZetkinSurveyOption) => (
            <MenuItem key={option.id} value={option.id}>
              {option.text}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};

export default OptionsQuestion;
