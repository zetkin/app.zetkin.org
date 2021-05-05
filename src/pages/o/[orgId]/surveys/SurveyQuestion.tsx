import { ZetkinSurveyQuestion } from '../../../../types/zetkin';

interface SurveyQuestionProps {
    question_props: ZetkinSurveyQuestion;
}

export default function SurveyQuestion({ question_props }: SurveyQuestionProps): JSX.Element {
    const { question, description, response_config } = question_props;
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
