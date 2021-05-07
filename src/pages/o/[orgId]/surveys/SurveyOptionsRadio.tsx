import { ZetkinSurveyOptionsQuestionElement } from '../../../../types/zetkin';

interface SurveyOptionsRadioProps {
    element: ZetkinSurveyOptionsQuestionElement;
}

export default function SurveyOptionsRadio({ element }: SurveyOptionsRadioProps): JSX.Element {
    const { options } = element.question;

    return (
        <div data-testid="response-radio">
            {
                options.map((option) => {
                    const htmlId = `${ element.id }-radio-${ option.id }`;
                    return (
                        <div key={ htmlId }>
                            <input id={ htmlId } name="options" type="radio" />
                            <label htmlFor={ htmlId }>{ option.text }</label>
                        </div>
                    );
                })
            }
        </div>
    );
}
