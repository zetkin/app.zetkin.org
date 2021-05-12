import { ZetkinSurveyOptionsQuestionElement } from '../../types/zetkin';

interface SurveyOptionsRadioProps {
    element: ZetkinSurveyOptionsQuestionElement;
    name: string;
    onValueChange: (name: string, val: number | number[]) => void;
    value: number;
}

export default function SurveyOptionsRadio({ element, name, onValueChange, value }: SurveyOptionsRadioProps): JSX.Element {
    const { options, required } = element.question;

    return (
        <div data-testid="response-radio">
            {
                options.map((option) => {
                    const htmlId = `${element.id}-radio-${option.id}`;
                    const checked = option.id === value;

                    const onChange = () => {
                        value = option.id;
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
                                type="radio"
                                value={ value }
                            />
                            <label htmlFor={ htmlId }>{ option.text }</label>
                        </div>
                    );
                })
            }
        </div>
    );
}
