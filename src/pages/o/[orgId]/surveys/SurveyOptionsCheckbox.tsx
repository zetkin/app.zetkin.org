import { ZetkinSurveyQuestionElement } from '../../../../types/zetkin';

interface SurveyOptionsCheckboxProps {
    element: ZetkinSurveyQuestionElement;
}


export default function SurveyOptionsCheckbox( { element } : SurveyOptionsCheckboxProps): JSX.Element {
    const { options } = element.question;

    return (
        <div data-testid="response-checkbox">
            {
                options?.map((option) => {
                    const htmlId = `${ element.id }-checkbox-${ option.id }`;
                    return (
                        <div key={ htmlId }>
                            <input id={ htmlId } name="options" type="checkbox"/>
                            <label htmlFor={ htmlId }>{ option.text }</label>
                        </div>
                    );
                })
            }
        </div>
    );
}
