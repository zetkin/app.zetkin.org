import { ZetkinSurveyOptionsQuestionElement } from '../../types/zetkin';

interface SurveyOptionsCheckboxProps {
    element: ZetkinSurveyOptionsQuestionElement;
    name: string;
    onValueChange: (name: string, val: string | number[]) => void;
    value: number[];
}

export default function SurveyOptionsCheckbox( { element, name, onValueChange, value } : SurveyOptionsCheckboxProps): JSX.Element {
    const { options, required } = element.question;

    return (
        <div data-testid="response-checkbox">
            {
                options.map((option) => {
                    const htmlId = `${ element.id }-checkbox-${ option.id }`;
                    const checked = value?.includes(option.id);

                    const onChange = () => {
                        if (value.indexOf(option.id) === -1) {
                            value.push(option.id);
                        }
                        else {
                            value.splice(value.indexOf(option.id), 1);
                        }
                        onValueChange(name, value);
                    };

                    return (
                        <div key={ htmlId }>
                            <input
                                checked={ checked }
                                id={ htmlId }
                                name={ name }
                                onChange={ onChange }
                                required={ required }
                                type="checkbox"
                            />
                            <label htmlFor={ htmlId }>{ option.text }</label>
                        </div>
                    );
                })
            }
        </div>
    );
}
