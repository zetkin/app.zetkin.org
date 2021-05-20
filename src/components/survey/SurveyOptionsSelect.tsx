import { ChangeEvent } from 'react';

import { ZetkinSurveyOptionsQuestionElement } from '../../types/zetkin';

interface SurveyOptionsSelectProps {
    element: ZetkinSurveyOptionsQuestionElement;
    name: string;
    onValueChange: (name: string, val: string | number[]) => void;
    value: number[];
}

export default function SurveyOptionsRadio( { element, name, onValueChange, value } : SurveyOptionsSelectProps): JSX.Element {
    const { options, required } = element.question;

    const onChange = (ev: ChangeEvent<HTMLSelectElement>) => {
        const newValue = [parseInt(ev.target.value)];
        onValueChange(name, newValue);
    };

    const defaultValue = value[0];

    return (
        <select
            data-testid="response-select"
            defaultValue={ defaultValue }
            name={ name }
            onBlur={ onChange }
            required={ required }>
            {
                options.map((option) => {
                    const htmlId = `${ element.id }-select-${ option.id }`;
                    return (
                        <option
                            key={ htmlId }
                            value={ option.id }>
                            { option.text }
                        </option>
                    );
                })
            }
        </select>
    );
}
