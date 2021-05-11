import { ZetkinSurveyOptionsQuestionElement } from '../../types/zetkin';

interface SurveyOptionsRadioProps {
    element: ZetkinSurveyOptionsQuestionElement;
}

export default function SurveyOptionsRadio({ element }: SurveyOptionsRadioProps): JSX.Element {
    const { options, required } = element.question;

    return (
        <div data-testid="response-radio">
            {
                options.map((option) => {
                    const htmlId = `${ element.id }-radio-${ option.id }`;
                    return (
                        <div key={ htmlId }>
                            <input id={ htmlId } name="options" required={ required } type="radio"/>
                            <label htmlFor={ htmlId }>{ option.text }</label>
                        </div>
                    );
                })
            }
        </div>
    );
}
