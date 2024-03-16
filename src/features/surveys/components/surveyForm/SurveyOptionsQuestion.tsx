import { FC } from 'react';
import SurveyContainer from './SurveyContainer';
import SurveyOption from './SurveyOption';
import SurveySubheading from './SurveySubheading';
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
    <FormControl fullWidth>
      <SurveyContainer>
        {element.question.response_config.widget_type === 'checkbox' && (
          <FormGroup aria-labelledby={`label-${element.id}`}>
            <FormLabel id={`label-${element.id}`}>
              <SurveySubheading>{element.question.question}</SurveySubheading>
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
        {(element.question.response_config.widget_type === 'radio' ||
          typeof element.question.response_config.widget_type ===
            'undefined') && (
          <RadioGroup
            aria-labelledby={`label-${element.id}`}
            name={`${element.id}.options`}
          >
            <Box display="flex" flexDirection="column" rowGap={1}>
              <FormLabel id={`label-${element.id}`}>
                <SurveySubheading>{element.question.question}</SurveySubheading>
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
      </SurveyContainer>
    </FormControl>
  );
};

export default OptionsQuestion;
