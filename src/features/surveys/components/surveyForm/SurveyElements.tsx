import { Box } from '@mui/system';
import { FC } from 'react';
import SurveyQuestion from './SurveyQuestion';
import SurveyTextBlock from './SurveyTextBlock';
import {
  ZetkinSurveyExtended,
  ZetkinSurveyTextElement,
} from 'utils/types/zetkin';

export type SurveyElementsProps = {
  formData: NodeJS.Dict<string | string[]>;
  survey: ZetkinSurveyExtended;
};

const SurveyElements: FC<SurveyElementsProps> = ({ formData, survey }) => {
  return (
    <>
      {survey.elements.map((element) => (
        <Box key={element.id}>
          {element.type === 'question' && (
            <SurveyQuestion element={element} formData={formData} />
          )}
          {element.type === 'text' && (
            <SurveyTextBlock element={element as ZetkinSurveyTextElement} />
          )}
        </Box>
      ))}
    </>
  );
};

export default SurveyElements;
