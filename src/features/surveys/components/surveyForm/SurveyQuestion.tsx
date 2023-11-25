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
  formData: NodeJS.Dict<string | string[]>;
};

const SurveyQuestion: FC<SurveyQuestionProps> = ({ element, formData }) => {
  return (
    <>
      {element.question.response_type === 'text' && (
        <SurveyTextQuestion
          element={element as ZetkinSurveyTextQuestionElement}
          formData={formData}
        />
      )}
      {element.question.response_type === 'options' && (
        <SurveyOptionsQuestion
          element={element as ZetkinSurveyOptionsQuestionElement}
          formData={formData}
        />
      )}
    </>
  );
};

export default SurveyQuestion;
