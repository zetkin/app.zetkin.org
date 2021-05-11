import SurveyOptionsCheckbox from './SurveyOptionsCheckbox';
import SurveyOptionsRadio from './SurveyOptionsRadio';
import SurveyOptionsSelect from './SurveyOptionsSelect';
import { ZetkinSurveyOptionsQuestionElement } from '../../types/zetkin';

interface SurveyOptionsQuestionProps {
    element: ZetkinSurveyOptionsQuestionElement;
}

export default function SurveyOptionsQuestion( { element } : SurveyOptionsQuestionProps): JSX.Element {
    const { response_config } = element.question;
    const { widget_type } = response_config;

    if (widget_type === 'radio') {
        return <SurveyOptionsRadio element={ element } />;
    }
    else if (widget_type === 'select') {
        return <SurveyOptionsSelect element={ element } />;
    }
    else {
        return <SurveyOptionsCheckbox element={ element } />;
    }
}
