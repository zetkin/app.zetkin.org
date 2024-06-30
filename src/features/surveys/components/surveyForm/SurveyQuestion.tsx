import { FC } from 'react';

import SurveyOptionsQuestion from './SurveyOptionsQuestion';
import SurveyTextQuestion from './SurveyTextQuestion';
import {
  ZetkinSurveyOptionsQuestionElement,
  ZetkinSurveyQuestionElement,
  ZetkinSurveyTextQuestionElement,
} from 'utils/types/zetkin';

export type SurveyQuestionProps = {
  element: ZetkinSurveyQuestionElement;
};

const SurveyQuestion: FC<SurveyQuestionProps> = ({ element }) => {
  return (
    <>
      {element.question.response_type === 'text' && (
        <SurveyTextQuestion
          element={element as ZetkinSurveyTextQuestionElement}
        />
      )}
      {element.question.response_type === 'options' && (
        <SurveyOptionsQuestion
          element={element as ZetkinSurveyOptionsQuestionElement}
        />
      )}
    </>
  );
};

export default SurveyQuestion;
