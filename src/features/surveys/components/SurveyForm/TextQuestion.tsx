import { FC } from 'react';
import { Box, FormControl, FormLabel } from '@mui/material';

import { useMessages } from 'core/i18n';
import { ZetkinSurveyTextQuestionElement } from 'utils/types/zetkin';
import ZUIText from 'zui/components/ZUIText';
import ZUITextField from 'zui/components/ZUITextField';
import messageIds from 'features/surveys/l10n/messageIds';

export type SurveyTextQuestionProps = {
  element: ZetkinSurveyTextQuestionElement;
  initialValue?: string;
  name: string;
};

const TextQuestion: FC<SurveyTextQuestionProps> = ({
  element,
  initialValue,
  name,
}) => {
  const messages = useMessages(messageIds);
  return (
    <FormControl fullWidth>
      <Box display="flex" flexDirection="column" rowGap={2}>
        <Box sx={{ wordBreak: 'break-word' }}>
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
          initialValue={initialValue}
          maxRows={element.question.response_config.multiline ? 4 : 1}
          multiline={element.question.response_config.multiline}
          name={name}
          required={element.question.required}
          size="large"
          type="text"
        />
      </Box>
    </FormControl>
  );
};

export default TextQuestion;
