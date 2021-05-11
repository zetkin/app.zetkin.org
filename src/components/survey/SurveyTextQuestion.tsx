import { ZetkinSurveyTextQuestionElement } from '../../types/zetkin';

interface SurveyTextQuestionProps {
    element: ZetkinSurveyTextQuestionElement;
}

export default function SurveyTextQuestion( { element } : SurveyTextQuestionProps ): JSX.Element {
    const { response_config, required } = element.question;
    const { multiline } = response_config;

    if (multiline) {
        return <textarea data-testid="response-multiline" required={ required }/>;
    }
    else {
        return <input data-testid="response-singleline" required={ required } type="text"/>;
    }
}
