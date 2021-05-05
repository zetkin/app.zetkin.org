import { ZetkinSurveyQuestion } from '../../../../types/zetkin';

interface SurveyTextQuestionProps {
    question: ZetkinSurveyQuestion;
}

export default function SurveyTextQuestion( props : SurveyTextQuestionProps ): JSX.Element {
    const { description, question, response_config } = props.question;
    const { multiline } = response_config;

    return (
        <>
            <h2 data-testid="question">{ question }</h2>
            <h3 data-testid="question-description">{ description }</h3>
            { multiline ?
                (<textarea data-testid="response-multiline" />) : (<input data-testid="response-singleline" type="text" />)
            }
        </>
    );
}
