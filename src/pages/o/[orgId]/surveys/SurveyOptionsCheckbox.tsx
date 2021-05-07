import { ZetkinSurveyOptionsQuestionElement } from '../../../../types/zetkin';

interface SurveyOptionsCheckboxProps {
    element: ZetkinSurveyOptionsQuestionElement;
}


export default function SurveyOptionsCheckbox( { element } : SurveyOptionsCheckboxProps): JSX.Element {
    const { options, required } = element.question;

    return (
        <div data-testid="response-checkbox">
            {
                options.map((option) => {
                    const htmlId = `${ element.id }-checkbox-${ option.id }`;
                    return (
                        <div key={ htmlId }>
                            <input id={ htmlId } name="options" required={ required } type="checkbox"/>
                            <label htmlFor={ htmlId }>{ option.text }</label>
                        </div>
                    );
                })
            }
        </div>
    );
}
