import { ChangeEvent } from 'react';

import { ZetkinSurveyOptionsQuestionElement } from '../../types/zetkin';

interface SurveyOptionsSelectProps {
    element: ZetkinSurveyOptionsQuestionElement;
    name: string;
    onValueChange: (name: string, val: string | number | number[]) => void;
    value: number;
}

export default function SurveyOptionsRadio( { element, name, onValueChange, value } : SurveyOptionsSelectProps): JSX.Element {
    const { options, required } = element.question;

    const onChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        value = parseInt(ev.target.value);
        onValueChange(name, value);
    };

    return (
        <select
            data-testid="response-select"
            name={ name }
            onBlur={ onChange }
            required={ required }>
            {
                options.map((option) => {
                    const selected = option.id === value;
                    const htmlId = `${ element.id }-select-${ option.id }`;
                    return (
                        <option
                            key={ htmlId }
                            selected={ selected }
                            value={ option.id }>
                            { option.text }
                        </option>
                    );
                })
            }
        </select>
    );
}
