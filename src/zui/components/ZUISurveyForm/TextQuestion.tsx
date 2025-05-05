import { FC } from 'react';
import { Box, FormControl, FormLabel } from '@mui/material';

import messageIds from 'features/surveys/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinSurveyTextQuestionElement } from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import ZUITextField from 'zui/components/ZUITextField';

export type SurveyTextQuestionProps = {
  element: ZetkinSurveyTextQuestionElement;
};

const TextQuestion: FC<SurveyTextQuestionProps> = ({ element }) => {
  const messages = useMessages(messageIds);
  return (
    <FormControl fullWidth>
      <Box display="flex" flexDirection="column" rowGap={2}>
        <Box>
          <FormLabel htmlFor={`input-${element.id}`}>
            <ZUIText variant="headingMd">
              <>
                {element.question.question}
                {element.question.required &&
                  ` (${messages.surveyForm.required()})`}
              </>
            </ZUIText>
          </FormLabel>
          {element.question.description && (
            <ZUIText id={`description-${element.id}`}>
              {element.question.description}
            </ZUIText>
          )}
        </Box>
        <ZUITextField
          ariaDescribedBy={`description-${element.id}`}
          id={`input-${element.id}`}
          maxRows={element.question.response_config.multiline ? 4 : 1}
          multiline={element.question.response_config.multiline}
          name={`${element.id}.text`}
          required={element.question.required}
          size="large"
          type="text"
        />
      </Box>
    </FormControl>
  );
};

export default TextQuestion;
