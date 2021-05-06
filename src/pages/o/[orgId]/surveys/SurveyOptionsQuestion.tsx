import SurveyOptionsCheckbox from './SurveyOptionsCheckbox';
import SurveyOptionsRadio from './SurveyOptionsRadio';
import SurveyOptionsSelect from './SurveyOptionsSelect';
import { ZetkinSurveyQuestionElement } from '../../../../types/zetkin';

interface SurveyOptionsQuestionProps {
    element: ZetkinSurveyQuestionElement;
}

export default function SurveyOptionsQuestion( { element } : SurveyOptionsQuestionProps): JSX.Element {
    const { response_config } = element.question;
    const { widget_type } = response_config;

    if (widget_type === 'radio') {
        return <SurveyOptionsRadio element={ element } />;
    }
    else if (widget_type === 'checkbox') {
        return <SurveyOptionsCheckbox element={ element } />;
    }
    else {
        return <SurveyOptionsSelect element={ element } />;
    }
}
