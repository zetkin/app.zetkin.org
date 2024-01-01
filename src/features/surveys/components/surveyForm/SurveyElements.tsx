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
    <>
      {survey.elements.map((element) => (
        <Box key={element.id}>
          {element.type === 'question' && <SurveyQuestion element={element} />}
          {element.type === 'text' && (
            <SurveyTextBlock element={element as ZetkinSurveyTextElement} />
          )}
        </Box>
      ))}
    </>
  );
};

export default SurveyElements;
