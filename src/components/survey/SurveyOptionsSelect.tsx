import { ZetkinSurveyOptionsQuestionElement } from '../../types/zetkin';

interface SurveyOptionsSelectProps {
    element: ZetkinSurveyOptionsQuestionElement;
}

export default function SurveyOptionsRadio( { element } : SurveyOptionsSelectProps): JSX.Element {
    const { options, required } = element.question;

    return (
        <select data-testid="response-select" required={ required }>
            {
                options.map((option) => {
                    const htmlId = `${ element.id }-select-${ option.id }`;
                    return (
                        <option key={ htmlId } value={ option.text }>{ option.text }</option>
                    );
                })
            }
        </select>
    );
}
