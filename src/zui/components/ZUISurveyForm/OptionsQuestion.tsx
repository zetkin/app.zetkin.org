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
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { FC, useCallback, useState } from 'react';

import messageIds from 'zui/l10n/messageIds';
import { useMessages } from 'core/i18n';
import {
  ZetkinSurveyOption,
  ZetkinSurveyOptionsQuestionElement,
} from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import ZUIPublicSurveyOption from '../ZUIPublicSurveyOption';

export type OptionsQuestionProps = {
  element: ZetkinSurveyOptionsQuestionElement;
};

const OptionsQuestion: FC<OptionsQuestionProps> = ({ element }) => {
  const messages = useMessages(messageIds);
  const [dropdownValue, setDropdownValue] = useState('');
  const handleDropdownChange = useCallback((ev: SelectChangeEvent) => {
    setDropdownValue(ev.target.value);
  }, []);

  const question = element.question;
  const widgetType = question.response_config.widget_type;
  const options = question.options || [];

  const hasRadios = !widgetType || widgetType == 'radio';
  const hasCheckboxes = widgetType === 'checkbox';
  const hasDropdown = widgetType == 'select';

  return (
    <FormControl fullWidth>
      {hasRadios && (
        <RadioGroup
          aria-describedby={`description-${element.id}`}
          aria-labelledby={`label-${element.id}`}
          name={`${element.id}.options`}
          sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
        >
          <Box display="flex" flexDirection="column">
            <FormLabel id={`label-${element.id}`}>
              <ZUIText variant="headingMd">
                {question.question}
                {question.required && ` (${messages.surveyForm.required()})`}
              </ZUIText>
            </FormLabel>
            {question.description && (
              <ZUIText id={`description-${element.id}`}>
                {question.description}
              </ZUIText>
            )}
          </Box>
          {options.map((option) => (
            <ZUIPublicSurveyOption
              key={option.id}
              control={<Radio required={question.required} />}
              label={option.text}
              value={option.id}
            />
          ))}
        </RadioGroup>
      )}
      {!hasRadios && (
        <FormGroup
          aria-describedby={`description-${element.id}`}
          aria-labelledby={`label-${element.id}`}
        >
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            maxWidth={{ sm: 'sm' }}
            overflow={'hidden'}
            width="100%"
          >
            <Box display="flex" flexDirection="column">
              <FormLabel id={`label-${element.id}`}>
                <ZUIText variant="headingMd">
                  {question.question}
                  {question.required && ` (${messages.surveyForm.required()})`}
                </ZUIText>
              </FormLabel>
              {question.description && (
                <ZUIText id={`description-${element.id}`}>
                  {question.description}
                </ZUIText>
              )}
            </Box>
            {hasDropdown && (
              <Select
                aria-describedby={`description-${element.id}`}
                aria-labelledby={`label-${element.id}`}
                name={`${element.id}.options`}
                onChange={handleDropdownChange}
                required={question.required}
                value={dropdownValue}
              >
                {question.options!.map((option: ZetkinSurveyOption) => (
                  <MenuItem key={option.id} value={option.id}>
                    <Typography
                      sx={(theme) => ({
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '1rem',
                        fontWeight: 400,
                        letterSpacing: '3%',
                      })}
                    >
                      {option.text}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            )}
            {hasCheckboxes &&
              options.map((option) => (
                <ZUIPublicSurveyOption
                  key={option.id}
                  control={<Checkbox name={`${element.id}.options`} />}
                  label={option.text}
                  value={option.id}
                />
              ))}
          </Box>
        </FormGroup>
      )}
    </FormControl>
  );
};

export default OptionsQuestion;
