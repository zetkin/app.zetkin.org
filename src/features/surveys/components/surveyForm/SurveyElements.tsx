import { Box } from '@mui/system';
import { FC } from 'react';
import SurveyQuestion from './SurveyQuestion';
import SurveyTextBlock from './SurveyTextBlock';
import {
  ZetkinSurveyExtended,
  ZetkinSurveyTextElement,
} from 'utils/types/zetkin';

export type SurveyElementsProps = {
  survey: ZetkinSurveyExtended;
};

const SurveyElements: FC<SurveyElementsProps> = ({ survey }) => {
  return (
    <Box display="flex" flexDirection="column" gap={4} paddingX={2}>
      {survey.elements
        .filter((element) => element.hidden !== true)
        .map((element) => (
          <Box key={element.id}>
            {element.type === 'question' && (
              <SurveyQuestion element={element} />
            )}
            {element.type === 'text' && (
              <SurveyTextBlock element={element as ZetkinSurveyTextElement} />
            )}
          </Box>
        ))}
    </Box>
  );
};

export default SurveyElements;
