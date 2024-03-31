import { FC } from 'react';
import messageIds from 'features/surveys/l10n/messageIds';
import SurveyContainer from './SurveyContainer';
import SurveyQuestionDescription from './SurveyQuestionDescription';
import SurveySubheading from './SurveySubheading';
import { useMessages } from 'core/i18n';
import { ZetkinSurveyTextQuestionElement } from 'utils/types/zetkin';
import { Box, FormControl, FormLabel, TextField } from '@mui/material';

export type SurveyOptionsQuestionProps = {
  element: ZetkinSurveyTextQuestionElement;
};

const SurveyOptionsQuestion: FC<SurveyOptionsQuestionProps> = ({ element }) => {
  const messages = useMessages(messageIds);
  return (
    <FormControl fullWidth>
      <SurveyContainer>
        <Box display="flex" flexDirection="column" rowGap={2}>
          <Box>
            <FormLabel htmlFor={`input-${element.id}`}>
              <SurveySubheading>
                <>
                  {element.question.question}
                  {element.question.required &&
                    ` (${messages.surveyForm.required()})`}
                </>
              </SurveySubheading>
            </FormLabel>
            {element.question.description && (
              <SurveyQuestionDescription id={`description-${element.id}`}>
                {element.question.description}
              </SurveyQuestionDescription>
            )}
          </Box>
          <TextField
            fullWidth
            id={`input-${element.id}`}
            inputProps={{ 'aria-describedby': `description-${element.id}` }}
            multiline={element.question.response_config.multiline}
            name={`${element.id}.text`}
            required={element.question.required}
            rows={element.question.response_config.multiline ? 4 : 1}
            type="text"
          />
        </Box>
      </SurveyContainer>
    </FormControl>
  );
};

export default SurveyOptionsQuestion;
