import { ZetkinSurveyQuestion } from '../../../../types/zetkin';

interface SurveyOptionsQuestionProps {
    question: ZetkinSurveyQuestion;
}

export default function SurveyOptionsQuestion( props : SurveyOptionsQuestionProps): JSX.Element {
    const { description, options, question } = props.question;

    return (
        <>
            <h2 data-testid="question">{ question }</h2>
            <h3 data-testid="question-description">{ description }</h3>
            <div data-testid="response-checkbox">
                {
                    options?.map((option) => {
                        const htmlId = `option-${option.id}`;
                        return (
                            <>
                                <input id={ htmlId } name="options" type="checkbox"/>
                                <label htmlFor={ htmlId }>{ option.text }</label>
                            </>
                        );
                    })
                }
            </div>
        </>
    );
}
