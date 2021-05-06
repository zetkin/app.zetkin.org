import SurveyOptionsQuestion from './SurveyOptionsQuestion';
import SurveyTextQuestion from './SurveyTextQuestion';
import { ZetkinSurveyQuestionElement } from '../../../../types/zetkin';

interface SurveyQuestionProps {
    element: ZetkinSurveyQuestionElement;
}

export default function SurveyQuestion( { element } : SurveyQuestionProps): JSX.Element {
    const { question: questionObject } = element;
    const { description, question, response_type } = questionObject;

    if (response_type === 'text') {
        return (
            <>
                <h2 data-testid="question">{ question }</h2>
                <h3 data-testid="question-description">{ description }</h3>
                <SurveyTextQuestion element={ element } />;
            </>
        );
    }
    else {
        return (
            <>
                <h2 data-testid="question">{ question }</h2>
                <h3 data-testid="question-description">{ description }</h3>
                <SurveyOptionsQuestion element={ element } />;
            </>
        );
    }
}
