import { ZetkinSurveyTextQuestionElement } from '../../../../types/zetkin';

interface SurveyTextQuestionProps {
    element: ZetkinSurveyTextQuestionElement;
}

export default function SurveyTextQuestion( { element } : SurveyTextQuestionProps ): JSX.Element {
    const { response_config } = element.question;
    const { multiline } = response_config;

    return (multiline ?
        (<textarea data-testid="response-multiline" />) : (<input data-testid="response-singleline" type="text" />)
    );
}
