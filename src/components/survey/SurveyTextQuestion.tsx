import { ChangeEvent } from 'react';

import { ZetkinSurveyTextQuestionElement } from '../../types/zetkin';

interface SurveyTextQuestionProps {
    element: ZetkinSurveyTextQuestionElement;
    name: string;
    onValueChange: (name: string, val: string | number | number[]) => void;
    value: string;
}

export default function SurveyTextQuestion( { element, name, onValueChange, value } : SurveyTextQuestionProps ): JSX.Element {
    const { response_config, required } = element.question;
    const { multiline } = response_config;

    const onChange = (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onValueChange(name, ev.target.value);
    };

    if (multiline) {
        return (<textarea
            data-testid="response-multiline"
            name={ name }
            onChange={ onChange }
            required={ required }
            value={ value }
        />);
    }
    else {
        return <input data-testid="response-singleline" required={ required } type="text"/>;
    }
}
