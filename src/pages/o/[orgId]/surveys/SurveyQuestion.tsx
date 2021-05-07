import SurveyOptionsQuestion from './SurveyOptionsQuestion';
import SurveyTextQuestion from './SurveyTextQuestion';
import {
    ZetkinSurveyQuestionElement,
    ZetkinSurveyTextQuestionElement,
} from '../../../../types/zetkin';

interface SurveyQuestionProps {
    element: ZetkinSurveyQuestionElement;
}

function isText(elem : ZetkinSurveyQuestionElement) : elem is ZetkinSurveyTextQuestionElement {
    return elem.question.response_type === 'text';
}

export default function SurveyQuestion( { element } : SurveyQuestionProps) : JSX.Element {
    const { question: questionObject } = element;
    const { description, question } = questionObject;

    if (isText(element)) {
        return (
            <>
                <h2 data-testid="question">{ question }</h2>
                <h3 data-testid="question-description">{ description }</h3>
                <SurveyTextQuestion element={ element } />
            </>
        );
    }
    else {
        return (
            <>
                <h2 data-testid="question">{ question }</h2>
                <h3 data-testid="question-description">{ description }</h3>
                <SurveyOptionsQuestion element={ element } />
            </>
        );
    }
}
