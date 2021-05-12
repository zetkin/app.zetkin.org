import SurveyOptionsCheckbox from './SurveyOptionsCheckbox';
import SurveyOptionsRadio from './SurveyOptionsRadio';
import SurveyOptionsSelect from './SurveyOptionsSelect';
import { ZetkinSurveyOptionsQuestionElement } from '../../types/zetkin';

interface SurveyOptionsQuestionProps {
    element: ZetkinSurveyOptionsQuestionElement;
    name: string;
    onValueChange: (name: string, val: number[]) => void;
    value: number[];
}

export default function SurveyOptionsQuestion( { element, name, onValueChange, value } : SurveyOptionsQuestionProps): JSX.Element {
    const { response_config } = element.question;
    const { widget_type } = response_config;

    if (widget_type === 'radio') {
        return <SurveyOptionsRadio element={ element } />;
    }
    else if (widget_type === 'select') {
        return <SurveyOptionsSelect element={ element } />;
    }
    else {
        return <SurveyOptionsCheckbox element={ element } name={ name } onValueChange={ onValueChange } value={ value }/>;
    }
}
