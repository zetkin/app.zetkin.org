import { FC } from 'react';
import SurveyOption from './SurveyOption';
import {
  Box,
  Checkbox,
  FormControl,
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

export type OptionsQuestionProps = {
  element: ZetkinSurveyOptionsQuestionElement;
};

const OptionsQuestion: FC<OptionsQuestionProps> = ({ element }) => {
  return (
    <FormControl>
      {element.question.response_config.widget_type === 'checkbox' && (
        <FormGroup aria-labelledby={`label-${element.id}`}>
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
          <Box display="flex" flexDirection="column" rowGap={1}>
            {element.question.options!.map((option: ZetkinSurveyOption) => (
              <SurveyOption
                key={option.id}
                control={<Checkbox name={`${element.id}.options`} />}
                label={option.text}
                value={option.id}
              />
            ))}
          </Box>
        </FormGroup>
      )}
      {element.question.response_config.widget_type === 'radio' && (
        <RadioGroup
          aria-labelledby={`label-${element.id}`}
          name={`${element.id}.options`}
        >
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
          <Box display="flex" flexDirection="column" rowGap={1}>
            {element.question.options!.map((option: ZetkinSurveyOption) => (
              <SurveyOption
                key={option.id}
                control={<Radio />}
                label={option.text}
                value={option.id}
              />
            ))}
          </Box>
        </RadioGroup>
      )}
      {element.question.response_config.widget_type === 'select' && (
        <Select
          aria-labelledby={`label-${element.id}`}
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
