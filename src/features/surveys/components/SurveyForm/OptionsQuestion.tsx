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

import { useMessages } from 'core/i18n';
import {
  ZetkinSurveyOption,
  ZetkinSurveyOptionsQuestionElement,
} from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import ZUIPublicSurveyOption from '../../../../zui/components/ZUIPublicSurveyOption';
import messageIds from 'features/surveys/l10n/messageIds';

export type OptionsQuestionProps = {
  element: ZetkinSurveyOptionsQuestionElement;
  initialValue?: string | string[];
  name: string;
};

const OptionsQuestion: FC<OptionsQuestionProps> = ({
  element,
  initialValue,
  name,
}) => {
  const messages = useMessages(messageIds);
  const [dropdownValue, setDropdownValue] = useState(
    initialValue?.toString() || ''
  );
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
          defaultValue={initialValue}
          name={name}
          sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
        >
          <Box
            display="flex"
            flexDirection="column"
            sx={{ wordBreak: 'break-word' }}
          >
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
            overflow={'hidden'}
            sx={{ wordBreak: 'break-word' }}
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
                name={name}
                onChange={handleDropdownChange}
                required={question.required}
                sx={{
                  '& p': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  },
                }}
                value={dropdownValue}
              >
                {options.map((option: ZetkinSurveyOption) => (
                  <MenuItem key={option.id} value={option.id}>
                    <Typography
                      noWrap
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
                  control={
                    <Checkbox
                      defaultChecked={initialValue?.includes(
                        option.id.toString()
                      )}
                      name={`${element.id}.options`}
                    />
                  }
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
