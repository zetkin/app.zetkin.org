import SurveyOptionsCheckbox from './SurveyOptionsCheckbox';
import SurveyOptionsRadio from './SurveyOptionsRadio';
import { ZetkinSurveyQuestion } from '../../../../types/zetkin';

interface SurveyOptionsQuestionProps {
    question: ZetkinSurveyQuestion;
    elementId: number;
}

export default function SurveyOptionsQuestion( props : SurveyOptionsQuestionProps): JSX.Element {
    const { response_config } = props.question;
    const { widget_type } = response_config;

    if (widget_type === 'radio') {
        return <SurveyOptionsRadio elementId={ props.elementId } question={ props.question } />;
    }
    else {
        return <SurveyOptionsCheckbox elementId={ props.elementId } question={ props.question } />;
    }
}
