import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import messageIds from 'features/surveys/l10n/messageIds';
import { useMessages } from 'core/i18n';
import {
  ZetkinSurveyOption,
  ZetkinSurveyOptionsQuestionElement,
} from 'utils/types/zetkin';
import SurveyContainer from 'features/surveys/components/surveyForm/SurveyContainer';
import SurveySubheading from 'features/surveys/components/surveyForm/SurveySubheading';
import SurveyQuestionDescription from 'features/surveys/components/surveyForm/SurveyQuestionDescription';

export type OptionsQuestionProps = {
  element: ZetkinSurveyOptionsQuestionElement;
  onChange: (value: number | number[]) => void;
};

const SurveyOptions: FC<OptionsQuestionProps> = ({ element, onChange }) => {
  const messages = useMessages(messageIds);
  const question = element.question;
  const [selectedValue, setSelectedValue] = useState<number | undefined>(
    undefined
  );
  const [selectedCheckboxValues, setSelectedCheckboxValues] = useState<
    number[]
  >([]);

  const [selectedDropdownValue, setSelectedDropdownValue] = useState<
    number | undefined
  >(undefined);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOptionId = Number(event.target.value);
    setSelectedValue(selectedOptionId);
    onChange([selectedOptionId]);
  };

  const handleCheckboxChange = (optionId: number) => {
    setSelectedCheckboxValues((prev) => {
      const newValue = prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId];
      onChange(newValue);
      return newValue;
    });
  };

  const handleDropdownChange = (event: SelectChangeEvent<number>) => {
    const selectedOptionId = Number(event.target.value);
    setSelectedDropdownValue(selectedOptionId);
    onChange([selectedOptionId]);
  };

  return (
    <FormControl fullWidth>
      <SurveyContainer>
        {question.response_config.widget_type === 'checkbox' && (
          <FormGroup>
            <Box display="flex" flexDirection="column" rowGap={2} width="100%">
              <Box>
                <FormLabel>
                  <SurveySubheading>{question.question}</SurveySubheading>
                </FormLabel>
                {question.description && (
                  <SurveyQuestionDescription>
                    {question.description}
                  </SurveyQuestionDescription>
                )}
              </Box>
              <Box display="flex" flexDirection="column" rowGap={1}>
                {question.options!.map((option: ZetkinSurveyOption) => (
                  <FormControlLabel
                    key={option.id}
                    control={
                      <Checkbox
                        checked={selectedCheckboxValues.includes(option.id)}
                        onChange={() => handleCheckboxChange(option.id)}
                      />
                    }
                    label={option.text}
                  />
                ))}
              </Box>
            </Box>
          </FormGroup>
        )}

        {(question.response_config.widget_type === 'radio' ||
          typeof question.response_config.widget_type === 'undefined') && (
          <RadioGroup
            name={`${element.id}.options`}
            onChange={handleRadioChange}
            value={selectedValue}
          >
            <Box display="flex" flexDirection="column" rowGap={2}>
              <Box>
                <FormLabel>
                  <Typography>
                    {question.question}
                    {question.required
                      ? ` (${messages.surveyForm.required()})`
                      : ''}
                  </Typography>
                </FormLabel>
                {question.description && (
                  <SurveyQuestionDescription>
                    {question.description}
                  </SurveyQuestionDescription>
                )}
              </Box>
              <Box display="flex" flexDirection="column" rowGap={1}>
                {question.options!.map((option: ZetkinSurveyOption) => (
                  <FormControlLabel
                    key={option.id}
                    control={<Radio required={question.required} />}
                    label={option.text}
                    value={option.id}
                  />
                ))}
              </Box>
            </Box>
          </RadioGroup>
        )}

        {question.response_config.widget_type === 'select' && (
          <FormGroup>
            <Box display="flex" flexDirection="column" rowGap={2}>
              <Box>
                <FormLabel>
                  <Typography>
                    {question.question}
                    {question.required
                      ? `(${messages.surveyForm.required()})`
                      : ''}
                  </Typography>
                </FormLabel>
                {question.description && (
                  <SurveyQuestionDescription id={`description-${element.id}`}>
                    {question.description}
                  </SurveyQuestionDescription>
                )}
              </Box>
              <Select
                onChange={handleDropdownChange}
                required={question.required}
                value={selectedDropdownValue}
              >
                {question.options!.map((option: ZetkinSurveyOption) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.text}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </FormGroup>
        )}
      </SurveyContainer>
    </FormControl>
  );
};

export default SurveyOptions;
