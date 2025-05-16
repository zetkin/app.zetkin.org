import { Box } from '@mui/material';
import { FC } from 'react';

import {
  ZetkinSurveyExtended,
  ZetkinSurveyQuestionElement,
  ZetkinSurveyTextQuestionElement,
} from 'utils/types/zetkin';
import ZUIText from '../../../../zui/components/ZUIText';
import TextQuestion from './TextQuestion';
import OptionsQuestion from './OptionsQuestion';
import useServerSide from 'core/useServerSide';

type SurveyFormProps = {
  initialValues?: Record<string, string | string[]>;
  survey: ZetkinSurveyExtended;
};

const isTextQuestionType = (
  question: ZetkinSurveyQuestionElement
): question is ZetkinSurveyTextQuestionElement => {
  return question.question.response_type == 'text';
};

const SurveyForm: FC<SurveyFormProps> = ({ initialValues = {}, survey }) => {
  const isServer = useServerSide();

  if (isServer) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        paddingY: '1rem',
      }}
    >
      {survey.elements
        .filter((element) => element.hidden !== true)
        .map((element) => {
          const isTextBlock = element.type == 'text';
          const isTextQuestion = !isTextBlock && isTextQuestionType(element);
          const isOptionsQuestion = !isTextBlock && !isTextQuestion;

          return (
            <Box key={element.id}>
              {isTextBlock && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <ZUIText variant="headingMd">
                    {element.text_block.header}
                  </ZUIText>
                  <ZUIText>{element.text_block.content}</ZUIText>
                </Box>
              )}
              {isTextQuestion && (
                <TextQuestion
                  element={element}
                  initialValue={initialValues[`${element.id}.text`] as string}
                  name={`${element.id}.text`}
                />
              )}
              {isOptionsQuestion && (
                <OptionsQuestion
                  element={element}
                  initialValue={initialValues[`${element.id}.options`]}
                  name={`${element.id}.options`}
                />
              )}
            </Box>
          );
        })}
    </Box>
  );
};

export default SurveyForm;
