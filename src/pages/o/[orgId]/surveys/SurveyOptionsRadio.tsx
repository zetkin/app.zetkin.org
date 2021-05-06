import { ZetkinSurveyQuestion } from '../../../../types/zetkin';

interface SurveyOptionsRadioProps {
    question: ZetkinSurveyQuestion;
    elementId: number;
}

export default function SurveyOptionsRadio(props: SurveyOptionsRadioProps): JSX.Element {
    const { description, options, question } = props.question;

    return (
        <>
            <h2 data-testid="question">{ question }</h2>
            <h3 data-testid="question-description">{ description }</h3>
            <div data-testid="response-radio">
                {
                    options?.map((option) => {
                        const htmlId = `${ props.elementId }-radio-${ option.id }`;
                        return (
                            <>
                                <input id={ htmlId } name="options" type="radio" />
                                <label htmlFor={ htmlId }>{ option.text }</label>
                            </>
                        );
                    })
                }
            </div>
        </>
    );
}
