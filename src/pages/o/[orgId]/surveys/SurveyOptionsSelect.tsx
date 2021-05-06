import { ZetkinSurveyQuestion } from '../../../../types/zetkin';

interface SurveyOptionsSelectProps {
    question: ZetkinSurveyQuestion;
    elementId: number;
}

export default function SurveyOptionsRadio(props: SurveyOptionsSelectProps): JSX.Element {
    const { description, options, question } = props.question;

    return (
        <>
            <h2 data-testid="question">{ question }</h2>
            <h3 data-testid="question-description">{ description }</h3>
            <select data-testid="response-select">
                {
                    options?.map((option) => {
                        const htmlId = `${ props.elementId }-select-${ option.id }`;
                        return (
                            <option key={ htmlId } value={ option.text }>{ option.text }</option>
                        );
                    })
                }
            </select>
        </>
    );
}
