import SurveyOptionsQuestion from './SurveyOptionsQuestion';
import SurveyTextQuestion from './SurveyTextQuestion';
import {
    ZetkinSurveyQuestionElement,
    ZetkinSurveyTextQuestionElement,
} from '../../types/zetkin';

interface SurveyQuestionProps {
    element: ZetkinSurveyQuestionElement;
    onValueChange: (name: string, val: string | number | number[]) => void;
    value: string | number | number[];
}

function isText(elem : ZetkinSurveyQuestionElement) : elem is ZetkinSurveyTextQuestionElement {
    return elem.question.response_type === 'text';
}

export default function SurveyQuestion( { element, onValueChange, value } : SurveyQuestionProps) : JSX.Element {
    const { question: questionObject } = element;
    const { description, question, required } = questionObject;

    const name = `question-${ element.id }`;

    if (isText(element)) {
        return (
            <>
                <h2 data-testid="question">{ question }
                    { required ? (<span data-testid="required">*</span>) : null }
                </h2>
                <h3 data-testid="question-description">{ description }</h3>
                <SurveyTextQuestion
                    element={ element }
                    name={ name }
                    onValueChange={ onValueChange }
                    value={ value as string }
                />
            </>
        );
    }
    else {
        return (
            <>
                <h2 data-testid="question">{ question }
                    { required ? (<span data-testid="required">*</span>) : null }
                </h2>
                <h3 data-testid="question-description">{ description }</h3>
                <SurveyOptionsQuestion
                    element={ element }
                    name={ name }
                    onValueChange={ onValueChange }
                    value={ value as number | number[] }
                />
            </>
        );
    }
}
