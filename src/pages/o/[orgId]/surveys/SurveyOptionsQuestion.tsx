import SurveyOptionsCheckbox from './SurveyOptionsCheckbox';
import SurveyOptionsRadio from './SurveyOptionsRadio';
import SurveyOptionsSelect from './SurveyOptionsSelect';
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
    else if (widget_type === 'checkbox') {
        return <SurveyOptionsCheckbox elementId={ props.elementId } question={ props.question } />;
    }
    else {
        return <SurveyOptionsSelect elementId={ props.elementId } question={ props.question } />;
    }
}
