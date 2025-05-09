import { Box } from '@mui/material';
import { FC } from 'react';

import {
  ZetkinSurveyExtended,
  ZetkinSurveyQuestionElement,
  ZetkinSurveyTextQuestionElement,
} from 'utils/types/zetkin';
import ZUIText from '../ZUIText';
import TextQuestion from './TextQuestion';
import OptionsQuestion from './OptionsQuestion';
import useServerSide from 'core/useServerSide';

type ZUISurveyFormProps = {
  survey: ZetkinSurveyExtended;
};

const isTextQuestionType = (
  question: ZetkinSurveyQuestionElement
): question is ZetkinSurveyTextQuestionElement => {
  return question.question.response_type == 'text';
};

const ZUISurveyForm: FC<ZUISurveyFormProps> = ({ survey }) => {
  const isServer = useServerSide();
  if (isServer) {
    return null;
  }

  return (
    <>
      <input name="orgId" type="hidden" value={survey.organization.id} />
      <input name="surveyId" type="hidden" value={survey.id} />
      <Box display="flex" flexDirection="column" gap={4}>
        <Box display="flex" flexDirection="column" gap={4}>
          {survey.elements
            .filter((element) => element.hidden !== true)
            .map((element) => {
              const isTextBlock = element.type == 'text';
              const isTextQuestion =
                !isTextBlock && isTextQuestionType(element);
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
                  {isTextQuestion && <TextQuestion element={element} />}
                  {isOptionsQuestion && <OptionsQuestion element={element} />}
                </Box>
              );
            })}
        </Box>
      </Box>
    </>
  );
};

export default ZUISurveyForm;
